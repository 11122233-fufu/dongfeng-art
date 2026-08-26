import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/gallery',
      name: 'Gallery',
      // B设计：列表和详情在同一个页面，通过 route.params.id 控制是否弹出详情模态
      component: () => import('@/views/GalleryPage.vue'),
    },
    {
      path: '/gallery/:id',
      name: 'GalleryDetail',
      component: () => import('@/views/GalleryPage.vue'),
    },
    {
      path: '/culture',
      name: 'Culture',
      component: () => import('@/views/CulturePage.vue'),
    },
    {
      path: '/artists',
      name: 'Artists',
      component: () => import('@/views/ArtistsPage.vue'),
    },
    {
      path: '/media',
      name: 'Media',
      component: () => import('@/views/MediaPage.vue'),
    },
    {
      path: '/interact',
      name: 'Interact',
      component: () => import('@/views/InteractPage.vue'),
    },
    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/views/PracticePage.vue'),
    },
    {
      path: '/about',
      redirect: '/practice',
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundPage.vue'),
    },
  ],
})

export default router
