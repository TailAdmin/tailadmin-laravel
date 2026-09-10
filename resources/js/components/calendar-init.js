import { Calendar } from "fullcalendar";
import dayGridPlugin from "fullcalendar/daygrid";
import interactionPlugin from "fullcalendar/interaction";
import multiMonthPlugin from "fullcalendar/multimonth";
import themePlugin from "fullcalendar/themes/classic";
import timeGridPlugin from "fullcalendar/timegrid";

import "fullcalendar/skeleton.css";
import "fullcalendar/themes/classic/palette.css";
import "fullcalendar/themes/classic/theme.css";

export function calendarInit() {
  const calendarEl = document.querySelector("#calendar");

  if (!calendarEl) return;

  const isRtl = document.documentElement.dir === "rtl";
  const locale = document.documentElement.lang || "en";
  let isMobile = window.innerWidth < 640;

  // Initial Events matching Next.js
  const INITIAL_EVENTS = [
    {
      id: "1",
      title: "Event Conf.",
      start: new Date().toISOString().split("T")[0],
      extendedProps: { calendar: "Danger" },
    },
    {
      id: "2",
      title: "Meeting",
      start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      extendedProps: { calendar: "Success" },
    },
    {
      id: "3",
      title: "Workshop",
      start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      extendedProps: { calendar: "Primary" },
    },
  ];

  // Calendar Modal Elements
  const modalEl = document.getElementById("eventModal");
  const modalTitleInput = document.querySelector("#event-title");
  const modalStartDateInput = document.querySelector("#event-start-date");
  const modalEndDateInput = document.querySelector("#event-end-date");
  const modalAddBtn = document.querySelector(".btn-add-event");
  const modalUpdateBtn = document.querySelector(".btn-update-event");
  const modalHeaderTitle = document.querySelector("#eventModalLabel");

  const CALENDAR_VIEW_OPTIONS = [
    { key: "dayGridMonth", label: "Month" },
    { key: "multiMonthYear", label: "Year" },
    { key: "timeGridWeek", label: "Week" },
    { key: "timeGridDay", label: "Day" },
  ];

  let calendarInstance = null;
  let currentView = "dayGridMonth";
  let selectedEvent = null;

  // View Select Dropdown matching CalendarViewSelect.tsx
  function renderViewSelect(containerEl, activeViewKey, calendarRef) {
    if (!containerEl) return;
    const targetCalendar = calendarRef || calendarInstance;
    const activeOption =
      CALENDAR_VIEW_OPTIONS.find((v) => v.key === activeViewKey) ||
      CALENDAR_VIEW_OPTIONS.find((v) => v.key === "dayGridMonth") ||
      CALENDAR_VIEW_OPTIONS[0];

    containerEl.innerHTML = `
      <div class="calendar-view-dropdown relative">
        <button
          type="button"
          class="calendar-view-btn flex h-9 w-full min-w-18 items-center justify-center gap-1 rounded-lg border border-gray-300 ps-2.5 pe-1.5 text-xs font-medium text-gray-700 shadow-xs sm:min-w-20 sm:gap-1.5 sm:ps-3 sm:pe-2 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <span class="calendar-view-label">${activeOption.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calendar-view-chevron h-4 w-4 transition-transform duration-200 sm:h-4.5 sm:w-4.5">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div class="calendar-view-menu absolute end-0 z-50 mt-1.5 hidden w-36 max-w-[calc(100vw-32px)] space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg sm:w-38 dark:border-gray-700 dark:bg-gray-900">
          ${CALENDAR_VIEW_OPTIONS.map(
            (view) => `
            <button
              type="button"
              data-view-key="${view.key}"
              class="calendar-view-option w-full rounded-lg px-2.5 py-1.5 text-start text-xs text-gray-700 hover:bg-gray-100 sm:text-sm dark:text-gray-300 dark:hover:bg-white/5 ${
                activeViewKey === view.key
                  ? "bg-gray-100 font-medium dark:bg-white/5"
                  : "font-normal"
              }"
            >
              ${view.label}
            </button>
          `
          ).join("")}
        </div>
      </div>
    `;

    const dropdownContainer = containerEl.querySelector(".calendar-view-dropdown");
    if (!dropdownContainer) return;
    const btn = dropdownContainer.querySelector(".calendar-view-btn");
    const menu = dropdownContainer.querySelector(".calendar-view-menu");
    const chevron = dropdownContainer.querySelector(".calendar-view-chevron");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = menu.classList.contains("hidden");
      document
        .querySelectorAll(".calendar-view-menu")
        .forEach((m) => m.classList.add("hidden"));
      document
        .querySelectorAll(".calendar-view-chevron")
        .forEach((c) => c.classList.remove("rotate-180"));

      if (isHidden) {
        menu.classList.remove("hidden");
        chevron.classList.add("rotate-180");
        btn.setAttribute("aria-expanded", "true");
      } else {
        menu.classList.add("hidden");
        chevron.classList.remove("rotate-180");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    dropdownContainer
      .querySelectorAll(".calendar-view-option")
      .forEach((optionBtn) => {
        optionBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const viewKey = optionBtn.dataset.viewKey;
          currentView = viewKey;
          const cal = targetCalendar || calendarInstance;
          if (cal && typeof cal.changeView === "function") {
            cal.changeView(viewKey);
          }
          menu.classList.add("hidden");
          chevron.classList.remove("rotate-180");
          btn.setAttribute("aria-expanded", "false");
        });
      });
  }

  // Modal helpers
  const openModal = () => {
    if (modalEl) {
      modalEl.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    if (modalEl) {
      modalEl.style.display = "none";
      document.body.style.overflow = "";
    }
    selectedEvent = null;
    resetModalFields();
  };

  function resetModalFields() {
    if (modalTitleInput) modalTitleInput.value = "";
    if (modalStartDateInput) modalStartDateInput.value = "";
    if (modalEndDateInput) modalEndDateInput.value = "";
    const primaryRadio = document.querySelector(
      'input[name="event-level"][value="Primary"]'
    );
    if (primaryRadio) {
      primaryRadio.checked = true;
    }
  }

  // Add Event Handler
  const handleOpenAddModal = () => {
    selectedEvent = null;
    resetModalFields();

    if (modalHeaderTitle) modalHeaderTitle.textContent = "Add Event";
    if (modalAddBtn) modalAddBtn.style.display = "flex";
    if (modalUpdateBtn) modalUpdateBtn.style.display = "none";

    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const combineDate = `${yyyy}-${mm}-${dd}`;

    if (modalStartDateInput) modalStartDateInput.value = combineDate;
    if (modalEndDateInput) modalEndDateInput.value = combineDate;

    openModal();
  };

  // Date select handler
  const handleDateSelect = (info) => {
    selectedEvent = null;
    resetModalFields();

    if (modalHeaderTitle) modalHeaderTitle.textContent = "Add Event";
    if (modalAddBtn) modalAddBtn.style.display = "flex";
    if (modalUpdateBtn) modalUpdateBtn.style.display = "none";

    if (modalStartDateInput)
      modalStartDateInput.value = info.startStr ? info.startStr.split("T")[0] : "";
    if (modalEndDateInput) {
      modalEndDateInput.value = info.endStr
        ? info.endStr.split("T")[0]
        : info.startStr
        ? info.startStr.split("T")[0]
        : "";
    }

    openModal();
  };

  // Event click handler
  const handleEventClick = (info) => {
    const eventObj = info.event;
    if (eventObj.url) {
      window.open(eventObj.url);
      info.jsEvent.preventDefault();
      return;
    }

    selectedEvent = eventObj;
    const eventLevel = eventObj.extendedProps?.calendar || "Primary";
    const checkedRadio = document.querySelector(
      `input[name="event-level"][value="${eventLevel}"]`
    );

    if (modalHeaderTitle) modalHeaderTitle.textContent = "Edit Event";
    if (modalAddBtn) modalAddBtn.style.display = "none";
    if (modalUpdateBtn) {
      modalUpdateBtn.style.display = "flex";
      modalUpdateBtn.dataset.fcEventPublicId = eventObj.id;
    }

    if (modalTitleInput) modalTitleInput.value = eventObj.title;
    if (modalStartDateInput)
      modalStartDateInput.value = eventObj.startStr
        ? eventObj.startStr.split("T")[0]
        : "";
    if (modalEndDateInput)
      modalEndDateInput.value = eventObj.endStr
        ? eventObj.endStr.split("T")[0]
        : eventObj.startStr
        ? eventObj.startStr.split("T")[0]
        : "";

    if (checkedRadio) checkedRadio.checked = true;

    openModal();
  };

  // Initialize FullCalendar v7 matching Calendar.tsx
  const calendar = new Calendar(calendarEl, {
    plugins: [
      themePlugin,
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      multiMonthPlugin,
    ],
    initialView: "dayGridMonth",
    direction: isRtl ? "rtl" : "ltr",
    height: "auto",

    // Toolbar / Header configuration
    headerToolbar: {
      start: "prev,next addEventButton",
      center: "title",
      end: "",
    },
    headerToolbarClass:
      "sticky top-0! z-20! bg-white dark:bg-gray-900 flex-wrap! flex-row! items-center justify-between gap-3 sm:gap-4 [padding-inline:16px]! sm:[padding-inline:24px]! pt-4 sm:pt-6 pb-3 sm:pb-4",
    toolbarTitleClass:
      "text-base! sm:text-lg! font-semibold! text-gray-800 dark:text-white/90",
    toolbarSectionClass: (info) => {
      if (info.name === "start") {
        return "ta-toolbar-section ta-toolbar-start order-2 flex w-full items-center justify-between sm:order-1 sm:w-auto sm:justify-start gap-2";
      }
      if (info.name === "center") {
        return "ta-toolbar-section ta-toolbar-center order-1 flex items-center justify-start sm:order-2 sm:justify-center";
      }
      if (info.name === "end") {
        return "ta-toolbar-section ta-toolbar-end order-1 flex items-center justify-end sm:order-3 sm:justify-end";
      }
      return "ta-toolbar-section";
    },
    buttonGroupClass: "gap-2",
    buttons: {
      prev: {
        iconContent: {
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-5 sm:size-6 bg-transparent text-gray-700 rtl:rotate-180 dark:text-gray-400"><path d="M15 18l-6-6 6-6" /></svg>`,
        },
        className:
          "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
      },
      next: {
        iconContent: {
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-5 sm:size-6 bg-transparent text-gray-700 rtl:rotate-180 dark:text-gray-400"><path d="M9 18l6-6-6-6" /></svg>`,
        },
        className:
          "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
      },
      addEventButton: {
        text: "Add Event +",
        click: handleOpenAddModal,
        className:
          "rounded-lg! border-0! bg-brand-500! px-3! sm:px-4! py-2! sm:py-2.5! text-xs! sm:text-sm! font-medium! text-white hover:bg-brand-600! focus:shadow-none! w-auto!",
      },
    },

    // View specific styles
    views: {
      multiMonthYear: {
        multiMonthMaxColumns: 3,
        singleMonthClass: "fc-multimonth",
        tableClass:
          "overflow-visible! border-0! sm:border! sm:border-gray-200! dark:sm:border-gray-800! rounded-none! sm:rounded-lg! mt-0!",
        singleMonthHeaderClass:
          "mb-0! bg-white dark:bg-gray-900 sm:bg-transparent! dark:sm:bg-transparent!",
        tableHeaderClass:
          "mb-0! rounded-none! sm:rounded-t-lg! bg-gray-50 dark:bg-gray-900 dark:sm:bg-transparent!",
        tableBodyClass: "mt-0!",
        singleMonthMinWidth: 280,
        showNonCurrentDates: true,
        singleMonthHeaderInnerClass:
          "text-sm font-medium! text-gray-800 dark:text-white/90",
        dayHeaderRowClass: "fc-multimonth-day-header-row",
        dayHeaderClass: (data) =>
          data.inPopover
            ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
            : "border-0! bg-gray-50 py-2! dark:bg-gray-900 dark:sm:bg-transparent! first:rounded-none! first:sm:rounded-ss-lg! last:rounded-none! last:sm:rounded-se-lg!",
        dayHeaderInnerClass: (data) =>
          data.inPopover
            ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
            : "py-1 text-[11px] sm:text-xs font-medium text-gray-400 uppercase",
        dayCellClass: (data) => {
          if (data.inPopover) return "bg-transparent! p-3!";
          let cls = "relative! p-0.5 sm:p-1!";
          if (data.isToday)
            cls +=
              " isolate rounded-sm! bg-gray-100! dark:bg-gray-800/40! font-semibold text-brand-500 dark:text-brand-400";
          if (data.isOther) cls += " bg-transparent!";
          return cls;
        },
        dayCellInnerClass: (data) =>
          data.inPopover
            ? "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto"
            : "h-0 max-h-0 overflow-hidden invisible",
        dayCellTopInnerClass: "text-xs! sm:text-sm!",
        dayMaxEvents: 0,
        moreLinkClass:
          "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
        rowMoreLinkClass:
          "absolute! -top-0.5! sm:-top-1! start-0.5! z-10! border-0! bg-transparent! p-0!",
        rowMoreLinkInnerClass: "overflow-visible!",
        moreLinkContent() {
          return {
            html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5 sm:size-5.5 text-brand-500"><path d="M19 3v17a1 1 0 01-1.496.868l-4.512-2.578a2 2 0 00-1.984 0l-4.512 2.578A1 1 0 015 20V3z" /></svg></span>`,
          };
        },
      },
      dayGridMonth: {
        dayMaxEvents: isMobile ? 0 : 2,
        dayHeaderAlign: (data) => (data.inPopover ? "start" : "center"),
        dayHeaderClass: (data) =>
          data.inPopover
            ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
            : "border-x-0! border-t border-gray-200! bg-gray-50 dark:border-gray-800! dark:bg-gray-900",
        dayHeaderInnerClass: (data) =>
          data.inPopover
            ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
            : "px-1! py-2! sm:px-3! sm:py-3! md:px-5! md:py-4! text-xs! sm:text-sm! font-medium! text-gray-400 uppercase",
        dayCellClass: (data) => {
          if (data.inPopover) return "bg-transparent! p-3!";
          return `bg-transparent! p-1! sm:p-2! ${
            data.isToday ? "bg-gray-100! dark:bg-gray-800/40!" : ""
          }`;
        },
        dayCellInnerClass: (data) => {
          if (data.inPopover)
            return "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto";
          if (isMobile)
            return "h-0 max-h-0 overflow-hidden invisible";
          return data.isToday ? "rounded-sm!" : "";
        },
        rowMoreLinkClass: isMobile
          ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
        moreLinkClass:
          "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
        moreLinkContent: (args) => {
          if (isMobile) {
            return {
              html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5 sm:size-5.5 text-brand-500"><path d="M19 3v17a1 1 0 01-1.496.868l-4.512-2.578a2 2 0 00-1.984 0l-4.512 2.578A1 1 0 015 20V3z" /></svg></span>`,
            };
          }
          return {
            html: `<span class="fc-more-link-badge inline-flex items-center rounded-sm bg-brand-50 px-1 py-0.5 sm:px-1.5 text-[10px] sm:text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25">+${args.num} more</span>`,
          };
        },
      },
      timeGridWeek: {
        slotDuration: "01:00:00",
        slotMinHeight: 56,
        allDaySlot: true,
        dayMaxEvents: isMobile ? 0 : undefined,
        moreLinkClass:
          "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
        rowMoreLinkClass: isMobile
          ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
        moreLinkContent: isMobile
          ? () => ({
              html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5 sm:size-5.5 text-brand-500"><path d="M19 3v17a1 1 0 01-1.496.868l-4.512-2.578a2 2 0 00-1.984 0l-4.512 2.578A1 1 0 015 20V3z" /></svg></span>`,
            })
          : undefined,
        dayHeaderContent: (arg) => {
          const weekday = new Intl.DateTimeFormat(locale, {
            weekday: "short",
          })
            .format(arg.date)
            .toUpperCase();
          const day = new Intl.DateTimeFormat(locale, {
            day: "numeric",
          }).format(arg.date);
          return `${weekday} - ${day}`;
        },
        dayHeaderClass: (data) =>
          `border-0! bg-gray-50! dark:bg-gray-900! ${
            data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
          }`,
        dayHeaderInnerClass: (data) =>
          `px-1.5! sm:px-3! py-2.5! sm:py-3.5! text-center! text-[11px]! sm:text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
            data.isToday
              ? "font-semibold! text-brand-500! dark:text-brand-400!"
              : ""
          }`,
        slotHeaderDividerClass:
          "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
        slotHeaderClass:
          "px-1.5! sm:px-3! py-1.5! sm:py-2! text-start! text-[11px]! sm:text-xs! font-medium! text-gray-400! dark:text-gray-500!",
        slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
        dayLaneClass: (data) =>
          `border-gray-200! dark:border-gray-800! ${
            data.isToday
              ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!"
              : ""
          }`,
        allDayDividerClass:
          "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
        allDayHeaderClass:
          "border-0! bg-gray-50! text-[11px]! sm:text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
      },
      timeGridDay: {
        slotDuration: "00:30:00",
        slotMinHeight: 48,
        allDaySlot: true,
        dayMaxEvents: isMobile ? 0 : undefined,
        moreLinkClass:
          "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
        rowMoreLinkClass: isMobile
          ? "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible!" : "",
        moreLinkContent: isMobile
          ? () => ({
              html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5 sm:size-5.5 text-brand-500"><path d="M19 3v17a1 1 0 01-1.496.868l-4.512-2.578a2 2 0 00-1.984 0l-4.512 2.578A1 1 0 015 20V3z" /></svg></span>`,
            })
          : undefined,
        dayHeaderContent: (arg) => {
          const weekday = new Intl.DateTimeFormat(locale, {
            weekday: "short",
          })
            .format(arg.date)
            .toUpperCase();
          const day = new Intl.DateTimeFormat(locale, {
            day: "numeric",
          }).format(arg.date);
          return `${weekday} - ${day}`;
        },
        dayHeaderClass: (data) =>
          `border-0! bg-gray-50! dark:bg-gray-900! ${
            data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
          }`,
        dayHeaderInnerClass: (data) =>
          `px-2! sm:px-4! py-2.5! sm:py-3.5! text-center! text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
            data.isToday
              ? "font-semibold! text-brand-500! dark:text-brand-400!"
              : ""
          }`,
        slotHeaderDividerClass:
          "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
        slotHeaderClass:
          "px-2! sm:px-3! py-1.5! sm:py-2! text-start! text-[11px]! sm:text-xs! font-medium! text-gray-400! dark:text-gray-500!",
        slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
        dayLaneClass: (data) =>
          `border-gray-200! dark:border-gray-800! ${
            data.isToday
              ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!"
              : ""
          }`,
        allDayDividerClass:
          "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
        allDayHeaderClass:
          "border-0! bg-gray-50! text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
      },
    },

    // Body configuration
    borderless: true,
    viewClass:
      "border-t! border-b-0! border-x-0! border-gray-200! dark:border-gray-800!",
    dayHeaderDividerClass:
      "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
    slotMinHeight: 56,
    slotHeaderDividerClass:
      "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
    allDayDividerClass:
      "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
    eventClass: "focus:shadow-none",
    nowIndicator: false,
    columnEventClass:
      "bg-transparent! border-0! p-1! shadow-none! hover:shadow-none! focus:outline-none",
    columnEventInnerClass: "p-0! border-0! bg-transparent! h-full",
    tableHeaderSticky: true,
    tableClass: "overflow-hidden",
    rowEventClass:
      "bg-transparent! border-0! px-1! py-0.5! shadow-none! hover:shadow-none! focus:outline-none",
    rowEventInnerClass: "p-0! border-0! bg-transparent!",
    popoverFormat: { month: "short", day: "numeric", year: "numeric" },
    popoverClass:
      "z-99999! w-72 max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900",
    popoverCloseClass:
      "absolute end-3 top-2.5 flex size-7 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
    popoverCloseContent: {
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M18 6L6 18M6 6l12 12" /></svg>`,
    },

    selectable: true,
    events: INITIAL_EVENTS,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventContent(eventInfo) {
      const calendarLevel = (
        eventInfo.event.extendedProps?.calendar || "primary"
      ).toLowerCase();

      const colorMap = {
        success: {
          bg: "border border-success-100 bg-success-50 dark:border-success-500/20 dark:bg-success-500/15",
          dot: "bg-success-500",
          title: "text-success-700 dark:text-success-400",
          time: "text-success-600/80 dark:text-success-400/80",
        },
        danger: {
          bg: "border border-error-100 bg-error-50 dark:border-error-500/20 dark:bg-error-500/15",
          dot: "bg-error-500",
          title: "text-error-700 dark:text-error-400",
          time: "text-error-600/80 dark:text-error-400/80",
        },
        primary: {
          bg: "border border-brand-100 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/15",
          dot: "bg-brand-500",
          title: "text-brand-700 dark:text-brand-400",
          time: "text-brand-600/80 dark:text-brand-400/80",
        },
        warning: {
          bg: "border border-orange-100 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/15",
          dot: "bg-orange-500",
          title: "text-orange-700 dark:text-orange-400",
          time: "text-orange-600/80 dark:text-orange-400/80",
        },
      };

      const colors = colorMap[calendarLevel] || colorMap.primary;
      const isTimeGridView =
        !eventInfo.event?.allDay &&
        eventInfo.view?.type &&
        eventInfo.view.type.startsWith("timeGrid");

      if (isTimeGridView) {
        return {
          html: `
            <div dir="ltr" class="event-fc-color flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1 transition-colors sm:rounded-lg sm:p-1.5 ${colors.bg}">
              <div class="flex items-center gap-1 sm:gap-1.5">
                <div class="size-1.5 shrink-0 rounded-full sm:size-2 ${colors.dot}"></div>
                <div class="truncate text-[11px] font-semibold leading-tight sm:text-xs ${colors.title}">${eventInfo.event.title || ""}</div>
              </div>
              ${
                eventInfo.timeText
                  ? `<div class="mt-0.5 truncate ps-2.5 text-[10px] font-medium leading-tight sm:ps-3.5 sm:text-[11px] ${colors.time}">${eventInfo.timeText}</div>`
                  : ""
              }
            </div>
          `,
        };
      }

      return {
        html: `
          <div dir="ltr" class="event-fc-color flex items-center rounded-md py-1 ps-1.5 pe-2 transition-colors sm:rounded-lg sm:py-1.5 sm:ps-2.5 sm:pe-3 ${colors.bg}">
            <div class="fc-daygrid-event-dot ms-0 me-1 h-2.5 w-1 shrink-0 rounded-full border-none sm:me-2 sm:h-3.5 ${colors.dot}"></div>
            ${
              eventInfo.timeText
                ? `<div class="fc-event-time me-1 p-0 text-[10px] font-normal text-gray-500 sm:me-1.5 sm:text-xs dark:text-gray-400">${eventInfo.timeText}</div>`
                : ""
            }
            <div class="fc-event-title truncate p-0 text-[11px] font-medium text-gray-700 sm:text-xs dark:text-white">${eventInfo.event.title || ""}</div>
          </div>
        `,
      };
    },
    datesSet(arg) {
      currentView = arg.view.type;
      const calContainer = calendarEl.closest(".custom-calendar");
      if (calContainer) {
        if (currentView === "multiMonthYear") {
          calContainer.classList.add("fc-multimonth");
        } else {
          calContainer.classList.remove("fc-multimonth");
        }
      }
      requestAnimationFrame(() => {
        const chunk = calendarEl.querySelector(
          ".ta-toolbar-section:last-child"
        );
        if (chunk) {
          renderViewSelect(chunk, currentView, calendar);
        }
      });
    },
  });

  calendarInstance = calendar;
  calendar.render();

  window.addEventListener("resize", () => {
    const mobile = window.innerWidth < 640;
    if (isMobile !== mobile) {
      isMobile = mobile;
      calendar.setOption("views", {
        dayGridMonth: {
          dayMaxEvents: isMobile ? 0 : 2,
        },
        timeGridWeek: {
          dayMaxEvents: isMobile ? 0 : undefined,
        },
        timeGridDay: {
          dayMaxEvents: isMobile ? 0 : undefined,
        },
      });
    }
  });

  // Modal event listeners
  const modalCloseBtns = document.querySelectorAll(
    "#eventModal .modal-close-btn, #eventModal [data-close-modal]"
  );
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  // Add Event Form Submit
  if (modalAddBtn) {
    modalAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const title = modalTitleInput ? modalTitleInput.value.trim() : "";
      const start = modalStartDateInput ? modalStartDateInput.value : "";
      const end = modalEndDateInput
        ? modalEndDateInput.value
        : modalStartDateInput
        ? modalStartDateInput.value
        : "";
      const checkedRadio = document.querySelector(
        'input[name="event-level"]:checked'
      );
      const level = checkedRadio ? checkedRadio.value : "Primary";

      if (title) {
        calendar.addEvent({
          id: Date.now().toString(),
          title: title,
          start: start,
          end: end || start,
          allDay: true,
          extendedProps: { calendar: level },
        });
        closeModal();
      }
    });
  }

  // Update Event
  if (modalUpdateBtn) {
    modalUpdateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!selectedEvent) return;

      const title = modalTitleInput ? modalTitleInput.value.trim() : "";
      const start = modalStartDateInput ? modalStartDateInput.value : "";
      const end = modalEndDateInput
        ? modalEndDateInput.value
        : modalStartDateInput
        ? modalStartDateInput.value
        : "";
      const checkedRadio = document.querySelector(
        'input[name="event-level"]:checked'
      );
      const level = checkedRadio ? checkedRadio.value : "Primary";

      selectedEvent.setProp("title", title || "Event");
      selectedEvent.setStart(start);
      selectedEvent.setEnd(end || start);
      selectedEvent.setExtendedProp("calendar", level);

      closeModal();
    });
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".calendar-view-dropdown")) {
      document
        .querySelectorAll(".calendar-view-menu")
        .forEach((m) => m.classList.add("hidden"));
      document
        .querySelectorAll(".calendar-view-chevron")
        .forEach((c) => c.classList.remove("rotate-180"));
    }
  });
}
