import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import type { Audiobook } from '@/types'
import { formatDuration } from '@/lib/utils'

interface AudiobookCardProps {
  audiobook: Audiobook
}

export function AudiobookCard({ audiobook }: AudiobookCardProps) {
  return (
    <Link href={`/books/${audiobook.id}`}>
      <Card className="group cursor-pointer transition-transform hover:scale-105">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
          <Image
            src={audiobook.cover_image_url}
            alt={audiobook.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-1">{audiobook.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{audiobook.author}</p>
          <p className="text-xs text-muted-foreground">
            {formatDuration(audiobook.duration)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

