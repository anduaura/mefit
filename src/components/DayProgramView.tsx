import type { DayProgram, ProgramBlock, ProgramItem } from "@/lib/generator";

export default function DayProgramView({ day }: { day: DayProgram }) {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-brand-700">{day.dayName}</p>
            <h2 className="text-xl font-bold tracking-tight">{day.theme}</h2>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>{day.date}</p>
            <p>~{day.totalMinutes} min</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
      </header>

      {day.blocks.map((b, i) => (
        <BlockCard key={i} block={b} />
      ))}
    </div>
  );
}

function BlockCard({ block }: { block: ProgramBlock }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{block.title}</h3>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          {block.kind}
        </span>
      </div>
      {block.notes && <p className="mt-1 text-sm text-slate-600">{block.notes}</p>}
      <ul className="mt-3 divide-y divide-slate-100">
        {block.items.map((item, i) => (
          <ItemRow key={i} item={item} />
        ))}
      </ul>
    </section>
  );
}

function ItemRow({ item }: { item: ProgramItem }) {
  if (item.freeform) {
    return (
      <li className="py-3 text-sm">
        <p className="font-medium">{item.name}</p>
        <p className="text-slate-600">{item.freeform}</p>
      </li>
    );
  }
  return (
    <li className="py-3 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{item.name}</p>
        <p className="font-mono text-xs text-slate-700">
          {item.sets ? `${item.sets} × ` : ""}
          {item.prescription ?? ""}
        </p>
      </div>
      {item.description && <p className="mt-0.5 text-slate-600">{item.description}</p>}
      {item.cues && <p className="mt-0.5 text-slate-500">↪ {item.cues}</p>}
    </li>
  );
}
