import mixpanel from "mixpanel-browser";
import { useEffect } from "react";

mixpanel.init("ebb3db4e36d03ba3fb75eaf7a13d4d85", { track_pageview: true });

export function useRegisterMixpanel(
  user?: {
    name?: string;
    email?: string;
    userId?: string;
    isLoggedIn?: boolean;
  } | null
) {
  useEffect(() => {
    if (user?.isLoggedIn) {
      mixpanel.register({
        email: user.email,
        name: user.name,
        userId: user.userId,
      });
    }
  }, [user]);
}
export { mixpanel };
