import { useAuth } from "../lib/auth.jsx";
import ScopedPeopleList from "../components/ScopedPeopleList.jsx";

export default function Subscribers() {
  const { user } = useAuth();
  const isSubscriber = user?.role === "subscriber";

  return (
    <ScopedPeopleList
      title="Subscribers"
      description={
        isSubscriber
          ? "Subscribers do not manage other accounts."
          : user?.role === "super_admin"
            ? "All subscribers (claimed and unclaimed)."
            : "Subscribers in your hierarchy (claimed and unclaimed)."
      }
      roleFilter="subscriber"
      emptyLabel={
        isSubscriber ? "Nothing to show here" : "No subscribers in your scope"
      }
      emptyHint={
        isSubscriber
          ? "Use Profile for your account details."
          : "Invite subscribers from the Invitations page."
      }
    />
  );
}
