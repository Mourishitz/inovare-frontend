<script setup lang="ts">
import type { DateValue } from "@internationalized/date";

const props = defineProps({
  icon: {
    type: String,
    default: "i-lucide-calendar",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
  },
});

const inputDate = useTemplateRef("inputDate");
const popover = useTemplateRef("popover");

const modelValue = defineModel<DateValue>();

const handleCalendarSelect = (date: DateValue) => {
  modelValue.value = date;
  popover.value?.close();
};
</script>

<template>
  <UInputDate
    ref="inputDate"
    v-model="modelValue"
    locale="en-GB"
    :disabled="disabled"
    :size="size"
    class="w-full"
  >
    <template #leading>
      <UIcon
        :name="icon"
        :size="size === 'sm' ? 16 : size === 'md' ? 20 : 24"
        class="text-neutral-500"
      />
    </template>
    <template #trailing>
      <UPopover ref="popover" :reference="inputDate?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date"
          class="px-0"
        />

        <template #content>
          <UCalendar
            :model-value="modelValue"
            @update:model-value="handleCalendarSelect"
            class="p-2"
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
