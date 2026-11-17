<div class="flex flex-col gap-4">
    <x-ui.button-group>
        <x-ui.button-group>
            <x-ui.button variant="outline" size="icon" aria-label="Go Back">
                <x-svg.arrow-left class="rtl:rotate-180" />
            </x-ui.button>
        </x-ui.button-group>
        <x-ui.button-group>
            <x-ui.button variant="outline">Archive</x-ui.button>
            <x-ui.button variant="outline">Report</x-ui.button>
        </x-ui.button-group>
        <x-ui.button-group>
            <x-ui.button variant="outline" size="icon" aria-label="Go Next">
                <x-svg.arrow-right />
            </x-ui.button>
        </x-ui.button-group>
    </x-ui.button-group>
    <x-ui.button-group orientation="vertical" aria-label="Media controls" class="h-fit">
        <x-ui.button variant="outline" size="icon">
            <x-svg.plus />
        </x-ui.button>
        <x-ui.button variant="outline" size="icon">
            <x-svg.minus />
        </x-ui.button>
    </x-ui.button-group>
</div>

