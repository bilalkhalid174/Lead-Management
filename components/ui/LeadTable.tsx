interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
}

interface Props {
  leads: Lead[];
  loading: boolean;
  onEdit: (l: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadTable({
  leads,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <p>Loading...</p>;

  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-sm">
        <tr>
          <th className="p-3">Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {leads.map((l) => (
          <tr key={l.id} className="border-t">
            <td className="p-3">{l.name}</td>
            <td>{l.email}</td>
            <td>{l.status}</td>
            <td className="space-x-3">
              <button onClick={() => onEdit(l)}>Edit</button>
              <button onClick={() => onDelete(l.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}