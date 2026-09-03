<x-common.component-card title="Radio Buttons">
    <div class="flex flex-wrap items-center gap-8">
        <div x-data="{ checkboxToggle: false }">
            <label for="radioLabelOne"
                class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                <div class="relative">
                    <input type="checkbox" id="radioLabelOne" class="sr-only" @change="checkboxToggle = !checkboxToggle" />
                    <div :class="checkboxToggle ? 'border-brand-500 bg-brand-500' :
                        'bg-transparent border-gray-300 dark:border-gray-700'"
                        class="hover:border-brand-500 dark:hover:border-brand-500 ltr:mr-3 rtl:ml-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]">
                        <span class="h-2 w-2 rounded-full"
                            :class="checkboxToggle ? 'bg-white' : 'bg-white dark:bg-[#171f2e]'"></span>
                    </div>
                </div>
                Default
            </label>
        </div>

        <div x-data="{ checkboxToggle: true }">
            <label for="radioLabelTwo"
                class="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
                <div class="relative">
                    <input type="checkbox" id="radioLabelTwo" class="sr-only"
                        @change="checkboxToggle = !checkboxToggle" />
                    <div :class="checkboxToggle ? 'border-brand-500 bg-brand-500' :
                        'bg-transparent border-gray-300 dark:border-gray-700'"
                        class="hover:border-brand-500 dark:hover:border-brand-500 ltr:mr-3 rtl:ml-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]">
                        <span class="h-2 w-2 rounded-full"
                            :class="checkboxToggle ? 'bg-white' : 'bg-white dark:bg-[#171f2e]'"></span>
                    </div>
                </div>
                Secondary
            </label>
        </div>

        <div x-data="{ checkboxToggle: false }">
            <label for="radioLabelThree"
                class="flex cursor-pointer items-center text-sm font-medium text-gray-300 select-none dark:text-gray-700">
                <div class="relative">
                    <input type="checkbox" id="radioLabelThree" class="peer sr-only"
                        @change="checkboxToggle = !checkboxToggle" disabled />
                    <div :class="checkboxToggle ? 'bg-transparent border-gray-300 dark:border-gray-700' :
                        'border-brand-500 bg-brand-500'"
                        class="ltr:mr-3 rtl:ml-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]">
                        <span class="h-2 w-2 rounded-full"
                            :class="checkboxToggle ? 'bg-white' : 'bg-white dark:bg-[#171f2e]'"></span>
                    </div>
                </div>
                Disabled Secondary
            </label>
        </div>
    </div>
</x-common.component-card>
