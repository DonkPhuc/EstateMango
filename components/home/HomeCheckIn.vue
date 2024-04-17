<script setup lang="ts">
const selected = ref(new Date().getDate());
const token = ref("");

onMounted(() => {
  token.value = localStorage.getItem("token") || "";
});

const daysInMonth = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const days = new Date(currentYear, currentMonth, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return day;
  });
});

const { data, refresh } = await useFetch("/api/checkin", {
  method: "post",
  immediate: false,
  onRequest({ options }) {
    localStorage.setItem("token", token.value);
    options.body = {
      token: token.value,
      day: Number(selected.value),
    };
  },
  body: {
    token: token.value,
    day: Number(selected.value),
  },
});
</script>

<template>
  <UDashboardCard
    title="Check In"
    :description="`To day you checkIn at ${token}`"
    icon="i-heroicons-chart-bar-20-solid"
  >
    {{ data }}
    <div class="flex flex-col gap-4">
      <UInput
        v-model="token"
        color="primary"
        variant="outline"
        placeholder="Key"
      />
      <div class="flex gap-4 justify-between">
        <USelectMenu v-model="selected" class="w-full" :options="daysInMonth" />
        <UButton label="Check" @click="refresh" />
      </div>
    </div>
  </UDashboardCard>
</template>
