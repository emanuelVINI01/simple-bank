import Image from "next/image";

export type LocaleCode = "pt" | "en";

const FLAGS: Record<LocaleCode, { src: string; label: string }> = {
  pt: { src: "/flags/br.svg", label: "Português" },
  en: { src: "/flags/us.svg", label: "English" },
};

export function Flag({
  locale,
  className = "",
}: {
  locale: LocaleCode;
  className?: string;
}) {
  const flag = FLAGS[locale];

  return (
    <Image
      src={flag.src}
      alt={flag.label}
      width={20}
      height={15}
      className={`inline-block h-[0.9em] w-auto shrink-0 rounded-[2px] object-cover ${className}`}
    />
  );
}
