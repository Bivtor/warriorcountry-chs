<script lang="ts">
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="bg-white shadow-md">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Name -->
			<div class="flex-shrink-0">
				<a href="/" class="logo-style"> Carpinteria High School Track and Field </a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden space-x-8 sm:flex">
				<a
					href="/"
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
				>
					Home
				</a>
				<a
					href="/about"
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
				>
					About
				</a>
				<a
					href="/services"
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
				>
					Services
				</a>
				<a
					href="/portfolio"
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
				>
					Portfolio
				</a>
				<a
					href="/contact"
					class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
				>
					Contact
				</a>
			</nav>

			<!-- Mobile menu button -->
			<div class="sm:hidden">
				<button
					onclick={toggleMenu}
					class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-expanded={isMenuOpen}
					aria-label="Toggle menu"
				>
					<!-- Hamburger lines with animation -->
					<div class="relative h-6 w-6">
						<span
							class="absolute left-0 top-1 h-0.5 w-6 transform bg-current transition-all duration-300 ease-in-out {isMenuOpen
								? 'translate-y-2 rotate-45'
								: ''}"
						></span>
						<span
							class="absolute left-0 top-3 h-0.5 w-6 bg-current transition-all duration-300 ease-in-out {isMenuOpen
								? 'opacity-0'
								: ''}"
						></span>
						<span
							class="absolute left-0 top-5 h-0.5 w-6 transform bg-current transition-all duration-300 ease-in-out {isMenuOpen
								? '-translate-y-2 -rotate-45'
								: ''}"
						></span>
					</div>
				</button>
			</div>
		</div>

		<!-- Mobile Navigation Menu -->
		<div class="sm:hidden {isMenuOpen ? 'block' : 'hidden'}">
			<div class="space-y-1 border-t border-gray-200 bg-white px-2 pb-3 pt-2">
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					Home
				</a>
				<a
					href="/about"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					About
				</a>
				<a
					href="/services"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					Services
				</a>
				<a
					href="/portfolio"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					Portfolio
				</a>
				<a
					href="/contact"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
				>
					Contact
				</a>
			</div>
		</div>
	</div>
</header>
