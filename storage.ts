import type { StorageConfig } from '@keystone-6/core/types'

export const storage: Record<string, StorageConfig> = {
  images: {
    kind: 'local',
    type: 'image',
    generateUrl: (path: string) => `http://localhost:8000/images${path}`,
    serverRoute: {
      path: '/images',
    },
    storagePath: 'public/images',
  },
}
