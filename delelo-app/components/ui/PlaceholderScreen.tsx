import Card from "@/components/ui/Card";

/* Общий placeholder для разделов в разработке */
export default function PlaceholderScreen({
  title,
  section,
}: {
  title: string;
  section?: string;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
            🚧
          </div>
          <p className="text-lg font-medium text-slate-700">Раздел в разработке</p>
          <p className="max-w-md text-sm text-slate-500">
            {section ?? "Этот раздел появится в одном из следующих этапов проекта «ДЕЛО»."}
          </p>
        </div>
      </Card>
    </div>
  );
}
