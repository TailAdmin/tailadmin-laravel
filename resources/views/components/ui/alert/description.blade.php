@use('App\Support\TwMerge')
@php
    $classes = TwMerge::merge(
        '[&_a]:hover:text-foreground text-sm text-balance text-gray-500 group-has-[>svg]/alert:col-start-2 md:text-pretty dark:text-gray-400 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
        $attributes->get('class')
    );
@endphp
<div data-slot="alert-description" {{ $attributes->except('class') }} class="{{ $classes }}">{{ $slot }}</div>
