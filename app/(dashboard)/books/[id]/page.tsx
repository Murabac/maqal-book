interface BookDetailPageProps {
  params: {
    id: string
  }
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audiobook Details</h1>
      <p>Book ID: {params.id}</p>
      {/* Book details and chapters will be implemented here */}
    </div>
  )
}



