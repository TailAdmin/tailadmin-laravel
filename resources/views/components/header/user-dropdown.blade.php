<x-ui.dropdown-menu>
    <x-ui.dropdown-menu.trigger class="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400">
        <span class="me-3 h-11 w-11 overflow-hidden rounded-lg">
            <img width="44" height="44" src="/assets/images/user/owner.png" alt="User" />
        </span>

        <span class="me-1 block text-sm font-medium">Musharof</span>

        <x-svg.chevron-down class="size-5 text-gray-500 duration-200 dark:text-gray-400" x-bind:class="open ? 'rotate-180' : 'rotate-0'" />
    </x-ui.dropdown-menu.trigger>

    <x-ui.dropdown-menu.content align="end" :side-offset="12" class="w-65 p-3">
        <div class="px-3 py-2">
            <span class="block text-sm font-medium text-gray-700 dark:text-gray-400">Musharof Chowdhury</span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">randomuser@pimjo.com</span>
        </div>

        <x-ui.dropdown-menu.separator />

        <x-ui.dropdown-menu.item to="/profile">
            <x-svg.user-circle class="size-6" />
            {{ __('userDropdown.editProfile') }}
        </x-ui.dropdown-menu.item>

        <x-ui.dropdown-menu.item to="/profile">
            <x-svg.gear class="size-6" />
            {{ __('userDropdown.accountSettings') }}
        </x-ui.dropdown-menu.item>

        <x-ui.dropdown-menu.item to="/profile">
            <x-svg.info-circle class="size-6" />
            {{ __('userDropdown.support') }}
        </x-ui.dropdown-menu.item>

        <x-ui.dropdown-menu.sub>
            <x-ui.dropdown-menu.sub-trigger>
                <x-svg.globe class="size-6" />
                <span>{{ __('userDropdown.language') }}</span>
                <x-ui.badge variant="light" color="gray" size="sm" class="ms-auto me-1 h-auto gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 text-shadow-none dark:border-gray-800 dark:bg-white/3 dark:text-gray-300 dark:text-shadow-none [&>img]:size-3.5">
                    <span x-text="$store.direction.current.shortName"></span>
                    <img :src="'/assets/images/icons/' + $store.direction.current.flag" :alt="$store.direction.current.name" class="size-3.5 shrink-0 overflow-hidden rounded-full" />
                </x-ui.badge>
            </x-ui.dropdown-menu.sub-trigger>

            <x-ui.dropdown-menu.sub-content class="w-56 p-2">
                <template x-for="language in $store.direction.languages" :key="language.id">
                    <x-ui.dropdown-menu.item
                        class="flex items-center justify-between gap-2"
                        x-bind:class="$store.direction.locale === language.id && 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'"
                        @click="$store.direction.select(language.id)">
                        <span class="flex items-center gap-2">
                            <span class="size-1.5 shrink-0 rounded-full transition-opacity"
                                x-bind:class="$store.direction.locale === language.id ? 'bg-brand-500 opacity-100 dark:bg-brand-400' : 'opacity-0'"></span>
                            <img :src="'/assets/images/icons/' + language.flag" :alt="language.name" class="size-5 shrink-0 overflow-hidden rounded-full" />
                            <span class="truncate" x-text="language.name"></span>
                        </span>

                        <template x-if="language.badge">
                            <x-ui.badge variant="light" color="warning" class="rounded text-xs" x-text="language.badge"></x-ui.badge>
                        </template>
                    </x-ui.dropdown-menu.item>
                </template>
            </x-ui.dropdown-menu.sub-content>
        </x-ui.dropdown-menu.sub>

        <x-ui.dropdown-menu.separator />

        <form id="logout-form" method="POST" action="{{ route('logout') }}" class="hidden">@csrf</form>
        <x-ui.dropdown-menu.item variant="destructive" x-on:click.capture="document.getElementById('logout-form').submit()">
            <x-svg.log-out />
            {{ __('userDropdown.signOut') }}
        </x-ui.dropdown-menu.item>
    </x-ui.dropdown-menu.content>
</x-ui.dropdown-menu>
