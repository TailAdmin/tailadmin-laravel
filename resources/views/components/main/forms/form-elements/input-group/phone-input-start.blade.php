<x-ui.field>
    <x-ui.field.label>Phone</x-ui.field.label>
    <x-ui.input-group class="overflow-hidden">
        <x-ui.input-group.addon align="inline-start" class="relative self-stretch border-e border-gray-200 p-0 dark:border-gray-800">
            <div class="relative flex h-full items-center">
                <select class="h-full cursor-pointer appearance-none border-0 border-none bg-transparent bg-none py-0 ps-3.5 pe-8 text-sm font-medium text-gray-700 shadow-none outline-hidden focus:border-0 focus:border-none focus:outline-hidden focus:ring-0 dark:text-gray-300 dark:hover:text-white dark:focus:text-white" @click.stop>
                    <option value="US" class="text-gray-700 dark:bg-gray-900 dark:text-gray-300">US</option>
                    <option value="GB" class="text-gray-700 dark:bg-gray-900 dark:text-gray-300">GB</option>
                    <option value="CA" class="text-gray-700 dark:bg-gray-900 dark:text-gray-300">CA</option>
                    <option value="AU" class="text-gray-700 dark:bg-gray-900 dark:text-gray-300">AU</option>
                </select>
                <x-svg.chevron-down class="pointer-events-none absolute end-2.5 size-4 text-gray-500 dark:text-gray-400" />
            </div>
        </x-ui.input-group.addon>
        <x-ui.input-group.input type="tel" placeholder="+1 (555) 000-0000" />
    </x-ui.input-group>
</x-ui.field>
