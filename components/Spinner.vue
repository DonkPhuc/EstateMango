<template>
  <div
    class="flex fixed justify-center items-center spinner h-full w-full opacity-75 bg-white/75"
  >
    <div class="relative inline-flex">
      <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
      <div
        class="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"
      ></div>
      <div
        class="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"
      ></div>
    </div>
  </div>
</template>

<style>
.spinner {
  z-index: 9999;
}
</style>
