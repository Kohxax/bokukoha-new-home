<script setup lang="ts">
import { Hash } from 'lucide-vue-next'

const props = defineProps<{
  toc?: {
    title: string
    searchDepth: number
    depth: number
    links: Array<{
      id: string
      depth: number
      text: string
      children?: any[]
    }>
  }
}>()

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

const activeId = ref<string>('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-100px 0px -66% 0px' },
  )

  document.querySelectorAll('h2, h3, h4').forEach((h) => {
    observer.observe(h)
  })

  onUnmounted(() => {
    document.querySelectorAll('h2, h3, h4').forEach((h) => {
      observer.unobserve(h)
    })
  })
})
</script>

<template>
  <Card
    class="w-full bg-card/50 backdrop-blur top-24 sticky max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
  >
    <CardHeader class="mt-4 -mb-2">
      <CardTitle class="text-foreground flex flex-row gap-2 items-center">
        <Hash class="h-5 w-5 text-primary" />
        <span class="text-lg font-semibold tracking-tight">目次</span>
      </CardTitle>
    </CardHeader>
    <CardContent class="pb-6">
      <nav v-if="toc && toc.links && toc.links.length > 0">
        <ul class="space-y-2 text-sm">
          <li v-for="(link, i) in toc.links" :key="link.id">
            <a
              :href="`#${link.id}`"
              @click.prevent="scrollToHeading(link.id)"
              class="group flex items-start gap-1 py-1 transition-colors hover:text-primary relative pl-2 border-l-2"
              :class="[
                activeId === link.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground',
              ]"
            >
              <span
                class="mt-0.5 min-w-6 text-sm font-mono group-hover:text-primary/70"
                :class="activeId === link.id ? 'text-primary' : 'text-muted-foreground'"
              >
                {{ i + 1 }}.
              </span>
              <span class="leading-relaxed">{{ link.text }}</span>
            </a>

            <ul v-if="link.children && link.children.length > 0" class="mt-2 space-y-2 pl-2">
              <li v-for="(childLink, j) in link.children" :key="childLink.id">
                <a
                  :href="`#${childLink.id}`"
                  @click.prevent="scrollToHeading(childLink.id)"
                  class="group flex items-start gap-1 py-0.5 transition-colors hover:text-primary relative pl-2 border-l-2"
                  :class="[
                    activeId === childLink.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground',
                  ]"
                >
                  <span
                    class="mt-0.5 min-w-8 text-xs font-mono group-hover:text-primary/70"
                    :class="activeId === childLink.id ? 'text-primary' : 'text-muted-foreground/70'"
                  >
                    {{ i + 1 }}.{{ j + 1 }}.
                  </span>
                  <span class="leading-relaxed">{{ childLink.text }}</span>
                </a>

                <ul
                  v-if="childLink.children && childLink.children.length > 0"
                  class="mt-1 space-y-1 pl-2"
                >
                  <li v-for="(grandChildLink, k) in childLink.children" :key="grandChildLink.id">
                    <a
                      :href="`#${grandChildLink.id}`"
                      @click.prevent="scrollToHeading(grandChildLink.id)"
                      class="group flex items-start gap-2 py-0.5 transition-colors hover:text-primary relative pl-2 border-l-2"
                      :class="[
                        activeId === grandChildLink.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground/80',
                      ]"
                    >
                      <span
                        class="mt-0.5 min-w-10 text-[10px] font-mono group-hover:text-primary/70"
                        :class="
                          activeId === grandChildLink.id
                            ? 'text-primary'
                            : 'text-muted-foreground/60'
                        "
                      >
                        {{ i + 1 }}.{{ j + 1 }}.{{ k + 1 }}.
                      </span>
                      <span class="leading-relaxed">{{ grandChildLink.text }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div v-else class="text-sm text-muted-foreground">目次はありません</div>
    </CardContent>
  </Card>
</template>
