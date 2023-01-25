import type { StorageConfig } from '@keystone-6/core/types'

export const storage: Record<string, StorageConfig> = {
  images: {
    kind: 'local',
    type: 'image',
    generateUrl: (path: string) => `${path}`,
    serverRoute: {
      path: '/images',
    },
    storagePath: 'public/images',
  },
}
