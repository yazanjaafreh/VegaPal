import { useEffect, useState } from "react";
import { fetchAdminMe } from "@/lib/admin/admin-client";
import { useSession } from "@/lib/vegapal-store";

export function useIsAdmin() {
  const { user } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setChecked(true);
      return;
    }

    let cancelled = false;
    setChecked(false);
    fetchAdminMe()
      .then((result) => {
        if (!cancelled) setIsAdmin(result.isAdmin);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { isAdmin, checked };
}
