<script setup>
import { onMounted, ref } from 'vue'
import { useAchievementStore } from '@/stores/achievements'
import { useApplicationStore } from '@/stores/application'
import { useRouter } from 'vue-router'
import AchievementCard from '@/components/cards/AchievementCard.vue'
import AppButton from '@/components/buttons/AppButton.vue'
const achievementStore = useAchievementStore()
const applicationStore = useApplicationStore()
const router = useRouter()

const achievement = ref({})

onMounted(() => {
  achievement.value = achievementStore.unlockAchievement(
    router.currentRoute.value.params.mode,
    router.currentRoute.value.params.difficulty,
  )
})
</script>

<template>
  <section class="flex flex-col gap-10 items-center">
    <h1 :class="['font-semibold text-3xl', achievement.type === 'egypt' && 'text-amber-500']">
      Você desbloqueou:
    </h1>
    <div class="w-1/4">
      <AchievementCard
        v-if="achievement"
        :name="achievement.name"
        :type="achievement.type"
        unlocked
        @click="router.push('/achievements')"
      />
    </div>
    <div class="flex gap-5">
      <AppButton text="Voltar" mode="orange" @on-click="router.push('/')" />
      <AppButton
        text="Continuar"
        mode="orange"
        @on-click="
          router.push(
            applicationStore.getNextRoute({
              mode: router.currentRoute.value.params.mode,
              difficulty: router.currentRoute.value.params.difficulty,
              phase: 'three',
              success: true,
            }),
          )
        "
      />
    </div>
  </section>
</template>
