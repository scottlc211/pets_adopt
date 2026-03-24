import { useEffect, useState } from 'react';
import { fetchPetById, fetchPets } from '../services/pets';
import type { Pet } from '../types';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchPets()
      .then((nextPets) => {
        if (!cancelled) {
          setPets(nextPets);
          setError(null);
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : '宠物数据加载失败。');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { pets, loading, error };
}

export function usePet(petId?: string) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(Boolean(petId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setPet(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    fetchPetById(petId)
      .then((nextPet) => {
        if (!cancelled) {
          setPet(nextPet);
          setError(null);
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : '宠物详情加载失败。');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  return { pet, loading, error };
}
