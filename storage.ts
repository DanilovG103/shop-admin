import type { StorageConfig } from '@keystone-6/core/types'

export const storage: Record<string, StorageConfig> = {
  images: {
    kind: 'local',
    type: 'image',
    generateUrl: (path: string) => `${process.env.BASE_URL}/images${path}`,
    serverRoute: {
      path: '/images',
    },
    storagePath: 'public/images',
  },
}
