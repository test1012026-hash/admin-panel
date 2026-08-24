import ScopedPeopleList from "../components/ScopedPeopleList.jsx";

export default function Resellers() {
  return (
    <ScopedPeopleList
      title="Resellers"
      description="All reseller accounts on the platform."
      roleFilter="reseller"
      emptyLabel="No resellers yet"
      emptyHint="Invite a reseller from the Invitations page."
    />
  );
}
