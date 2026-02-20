import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

describe('Router', () => {
  let router

  beforeEach(() => {
    jest.resetModules()
    router = require('@/router').default
  })

  it('has a home route at /', () => {
    const route = router.resolve('/')
    expect(route.resolved.name).toBe('Home')
  })

  it('has a level route at /level/:level', () => {
    const route = router.resolve('/level/1')
    expect(route.resolved.name).toBe('Level')
    expect(route.resolved.params.level).toBe('1')
  })

  it('redirects unknown paths to /', () => {
    const route = router.resolve('/nonexistent')
    expect(route.resolved.path).toBe('/')
  })

  describe('route guard', () => {
    it('allows valid level (1)', async () => {
      await router.push('/level/1')
      expect(router.currentRoute.name).toBe('Level')
      expect(router.currentRoute.params.level).toBe('1')
    })

    it('allows valid level (2)', async () => {
      await router.push('/level/2')
      expect(router.currentRoute.name).toBe('Level')
    })

    it('allows valid level (3)', async () => {
      await router.push('/level/3')
      expect(router.currentRoute.name).toBe('Level')
    })

    it('redirects invalid level to home', async () => {
      // Use try/catch because VueRouter throws NavigationDuplicated on redirect to /
      try {
        await router.push('/level/4')
      } catch (e) {
        // NavigationDuplicated error is expected when redirecting to current route
      }
      expect(router.currentRoute.name).toBe('Home')
    })

    it('redirects non-numeric level to home', async () => {
      try {
        await router.push('/level/abc')
      } catch (e) {
        // NavigationDuplicated error is expected
      }
      expect(router.currentRoute.name).toBe('Home')
    })

    it('allows navigation to home after level', async () => {
      await router.push('/level/1')
      await router.push('/')
      expect(router.currentRoute.name).toBe('Home')
    })
  })
})
