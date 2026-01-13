import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import type { Audiobook } from '@/types'

interface AudiobookCardProps {
  audiobook: Audiobook
}

export function AudiobookCard({ audiobook }: AudiobookCardProps) {
  const isArabic = audiobook.language === 'Arabic'
  const textDirection = isArabic ? 'rtl' : 'ltr'
  
  return (
    <Link href={`/books/${audiobook.id}`} prefetch={true}>
      <Card className="group cursor-pointer transition-transform hover:scale-105">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
          <Image
            src={audiobook.cover}
            alt={audiobook.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <CardContent className="p-4" dir={textDirection}>
          <h3 className={`font-semibold line-clamp-2 mb-1 ${isArabic ? 'font-arabic' : ''}`}>
            {audiobook.title}
          </h3>
          <p className={`text-sm text-muted-foreground mb-2 ${isArabic ? 'font-arabic' : ''}`}>
            {audiobook.author}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{audiobook.duration}</p>
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
              {audiobook.language}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

