<div x-data="{
    transactions: [
        {
            id: 1,
            name: 'Bought PYPL',
            image: '/images/brand/brand-08.svg',
            date: 'Nov 23, 01:00 PM',
            price: '$2,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 2,
            name: 'Bought AAPL',
            image: '/images/brand/brand-07.svg',
            date: 'Nov 23, 01:00 PM',
            price: '$2,567.88',
            category: 'Finance',
            status: 'Pending',
        },
        {
            id: 3,
            name: 'Sell KKST',
            image: '/images/brand/brand-15.svg',
            date: 'Nov 23, 01:00 PM',
            price: '$2,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 4,
            name: 'Bought FB',
            image: '/images/brand/brand-02.svg',
            date: 'Nov 23, 01:00 PM',
            price: '$2,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 5,
            name: 'Sell AMZN',
            image: '/images/brand/brand-10.svg',
            date: 'Nov 23, 01:00 PM',
            price: '$2,567.88',
            category: 'Finance',
            status: 'Failed',
        },
        {
            id: 6,
            name: 'Bought MSFT',
            image: '/images/brand/brand-09.svg',
            date: 'Nov 22, 01:00 PM',
            price: '$1,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 7,
            name: 'Bought GOOG',
            image: '/images/brand/brand-01.svg',
            date: 'Nov 22, 01:00 PM',
            price: '$3,567.88',
            category: 'Finance',
            status: 'Pending',
        },
        {
            id: 8,
            name: 'Sell TSLA',
            image: '/images/brand/brand-12.svg',
            date: 'Nov 22, 01:00 PM',
            price: '$4,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 9,
            name: 'Bought NVDA',
            image: '/images/brand/brand-11.svg',
            date: 'Nov 22, 01:00 PM',
            price: '$5,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 10,
            name: 'Sell META',
            image: '/images/brand/brand-03.svg',
            date: 'Nov 22, 01:00 PM',
            price: '$6,567.88',
            category: 'Finance',
            status: 'Failed',
        },
        {
            id: 11,
            name: 'Bought DIS',
            image: '/images/brand/brand-04.svg',
            date: 'Nov 21, 01:00 PM',
            price: '$7,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 12,
            name: 'Bought NFLX',
            image: '/images/brand/brand-05.svg',
            date: 'Nov 21, 01:00 PM',
            price: '$8,567.88',
            category: 'Finance',
            status: 'Pending',
        },
        {
            id: 13,
            name: 'Sell CRM',
            image: '/images/brand/brand-06.svg',
            date: 'Nov 21, 01:00 PM',
            price: '$9,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 14,
            name: 'Bought TSLA',
            image: '/images/brand/brand-13.svg',
            date: 'Nov 21, 01:00 PM',
            price: '$10,567.88',
            category: 'Finance',
            status: 'Success',
        },
        {
            id: 15,
            name: 'Sell AAPL',
            image: '/images/brand/brand-14.svg',
            date: 'Nov 21, 01:00 PM',
            price: '$11,567.88',
            category: 'Finance',
            status: 'Failed',
        },
    ],
    itemsPerPage: 5,
    currentPage: 1,
    dropdownOpen: null,
    get totalPages() {
        return Math.ceil(this.transactions.length / this.itemsPerPage);
    },
    get paginatedTransactions() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.transactions.slice(start, end);
    },
    get displayedPages() {
        const range = [];
        for (let i = 1; i <= this.totalPages; i++) {
            if (
                i === 1 ||
                i === this.totalPages ||
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                range.push(i);
            } else if (range[range.length - 1] !== '...') {
                range.push('...');
            }
        }
        return range;
    },
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    },
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    },
    goToPage(page) {
        if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    },
    getStatusClass(status) {
        const classes = {
            'Success': 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
            'Pending': 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-orange-400',
            'Failed': 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        };
        return classes[status] || '';
    },
    toggleDropdown(id) {
        this.dropdownOpen = this.dropdownOpen === id ? null : id;
    }
}">
    <div class="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <!-- Header -->
        <div class="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Latest Transactions</h3>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form>
                    <div class="relative">
                        <button type="button" class="absolute -translate-y-1/2 left-4 top-1/2">
                            <svg class="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z" fill=""/>
                            </svg>
                        </button>
                        <input type="text" placeholder="Search..." class="h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 xl:w-[300px]"/>
                    </div>
                </form>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden">
            <div class="max-w-full px-5 overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="border-gray-200 border-y dark:border-gray-700">
                            <th scope="col" class="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">Name</th>
                            <th scope="col" class="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">Date</th>
                            <th scope="col" class="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">Price</th>
                            <th scope="col" class="px-4 py-3 text-xs font-medium tracking-wider text-start text-gray-500 capitalize">Category</th>
                            <th scope="col" class="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">Status</th>
                            <th scope="col" class="relative px-4 py-3 capitalize">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <template x-for="transaction in paginatedTransactions" :key="transaction.id">
                            <tr>
                                <td class="py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="shrink-0 w-8 h-8">
                                            <img class="w-8 h-8 rounded-full" :src="transaction.image" alt="">
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white" x-text="transaction.name"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400" x-text="transaction.date"></div>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400" x-text="transaction.price"></div>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500 dark:text-gray-400" x-text="transaction.category"></div>
                                </td>
                                <td class="px-4 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(transaction.status)" x-text="transaction.status"></span>
                                </td>
                                <td class="px-4 py-4 text-sm font-medium text-right whitespace-nowrap">
                                    <div class="flex justify-center relative">
                                        <x-common.table-dropdown>
                                            <x-slot name="button">
                                                <button type="button" id="options-menu" aria-haspopup="true" aria-expanded="true" class="text-gray-500 dark:text-gray-400'">
                                                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </x-slot>
        
                                            <x-slot name="content">
                                                <a href="#" class="flex w-full px-3 py-2 font-medium text-start text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300" role="menuitem">
                                                    View More
                                                </a>
                                                <a href="#" class="flex w-full px-3 py-2 font-medium text-start text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300" role="menuitem">
                                                    Delete
                                                </a>
                                            </x-slot>
                                        </x-common.table-dropdown>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
            <div class="flex items-center justify-between">
                <button @click="prevPage" :disabled="currentPage === 1" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''" class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5">
                    <svg class="rtl:rotate-180" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z" fill="currentColor"/>
                    </svg>
                    <span class="hidden sm:inline">Previous</span>
                </button>

                <span class="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
                    Page <span x-text="currentPage"></span> of <span x-text="totalPages"></span>
                </span>

                <ul class="hidden items-center gap-0.5 sm:flex">
                    <template x-for="page in displayedPages" :key="page">
                        <li>
                            <button x-show="page !== '...'" @click="goToPage(page)" :class="currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/[0.08] hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500'" class="flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium" x-text="page"></button>
                            <span x-show="page === '...'" class="flex h-10 w-10 items-center justify-center text-gray-500">...</span>
                        </li>
                    </template>
                </ul>

                <button @click="nextPage" :disabled="currentPage === totalPages" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''" class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5">
                    <span class="hidden sm:inline">Next</span>
                    <svg class="rtl:rotate-180" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>