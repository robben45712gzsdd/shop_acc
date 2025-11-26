<template>
  <div class="flex justify-center items-center m-auto w-full h-full">
    <div class="loader"></div>
  </div>

</template>

<script>
export default {
  name: "LoadingSpinner",
};
</script>

<style lang="scss">
/* HTML: <div class="loader"></div> */
.loader {
  margin: 30px auto;
  --d:22px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  color: #FF733E;
  box-shadow: 
    calc(1*var(--d))      calc(0*var(--d))     0 0,
    calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
    calc(0*var(--d))      calc(1*var(--d))     0 2px,
    calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
    calc(-1*var(--d))     calc(0*var(--d))     0 4px,
    calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
    calc(0*var(--d))      calc(-1*var(--d))    0 6px;
  animation: l27 1s infinite steps(8);
}
@keyframes l27 {
  100% {transform: rotate(1turn)}
}
</style>