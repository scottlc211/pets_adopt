import React, { useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePet } from './hooks/usePets';
import AppShell from './layouts/AppShell';
import { submitApplication } from './services/applications';
import ApplicationFormScreen from './screens/ApplicationFormScreen';
import AuthScreen from './screens/AuthScreen';
import DetailScreen from './screens/DetailScreen';
import DiscoveryScreen from './screens/DiscoveryScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import type { AdoptionApplicationInput } from './types';

function PetDetailRoute() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { pet, loading } = usePet(petId);

  return (
    <DetailScreen
      pet={pet}
      loading={loading}
      onBack={() => navigate(-1)}
      onApply={(selectedPet) => navigate(`/apply?pet=${selectedPet.id}`)}
    />
  );
}

function ApplicationRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet, loading } = usePet(searchParams.get('pet') ?? undefined);
  const { user, mode } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });

  const handleSubmit = async (payload: AdoptionApplicationInput) => {
    if (!user) {
      setSubmitMessage({ type: 'error', text: '请先登录或注册，再提交领养申请。' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage({ type: null, text: '' });

    try {
      await submitApplication(payload, user);
      setSubmitMessage({
        type: 'success',
        text: '申请已提交，我们会尽快联系你确认后续安排。',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交失败，请稍后重试。';
      setSubmitMessage({ type: 'error', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ApplicationFormScreen
      mode={mode}
      pet={pet}
      petLoading={loading}
      submitting={submitting}
      submitMessage={submitMessage}
      user={user}
      onBrowsePets={() => navigate('/explore')}
      onOpenAuth={() => navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
      onSubmit={handleSubmit}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/explore" />} />
      <Route path="/auth" element={<AuthScreen />} />
      <Route path="/pets/:petId" element={<PetDetailRoute />} />
      <Route element={<AppShell />}>
        <Route path="/explore" element={<DiscoveryScreen />} />
        <Route path="/apply" element={<ApplicationRoute />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/explore" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
