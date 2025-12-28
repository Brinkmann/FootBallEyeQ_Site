interface StructuredDataProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  const json = Array.isArray(data) ? data : [data];

  return json.map((entry, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
    />
  ));
}
