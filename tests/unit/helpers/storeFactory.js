import Vuex from 'vuex'
import { createStoreConfig } from '@/store'

export function createTestStore(stateOverrides = {}) {
  const config = createStoreConfig()
  config.state = { ...config.state, ...stateOverrides }
  return new Vuex.Store(config)
}
