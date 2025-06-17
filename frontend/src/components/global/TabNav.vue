<script setup lang="ts">
import { ref } from "vue"
import Location from "@/components/tabs/Location.vue"
import { Plus } from "lucide-vue-next"
import Button from "../ui/button/Button.vue"
import axios from "axios"

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

const newLocationName = ref("")
const isPopoverOpen = ref(false)
const locationComponentRef = ref<InstanceType<typeof Location> | null>(null)
const API_BASE_URL = `https://${import.meta.env.VITE_API_DOMAIN}`

const AddLocation = async () => {
	if (!newLocationName.value.trim()) {
		console.error("Location name cannot be empty")
		return
	}
	try {
		const response = await axios.post(`${API_BASE_URL}/locations/new`, {
			name: newLocationName.value,
		})
		console.log("Location added:", response.data)
		newLocationName.value = ""
		isPopoverOpen.value = false
		locationComponentRef.value?.fetchLocations()
	} catch (error) {
		console.error("Failed to add location:", error)
	}
}
</script>

<template>
	<div class="flex justify-between items-center mb-4">
		<h2>Garden</h2>
		<Popover v-model:open="isPopoverOpen">
			<PopoverTrigger class="w-40">
				<Button variant="outline" size="icon" class="w-40">
					New Location<Plus class="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent class="w-80">
				<form @submit.prevent="AddLocation">
					<div class="grid gap-4">
						<label for="location-name" class="block text">
							Location Name
						</label>
						<input
							id="location-name"
							type="text"
							v-model="newLocationName"
							class="input input-bordered w-full"
							placeholder="Enter location name"
							required />
						<Button type="submit"> Add Location </Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	</div>
	<Location ref="locationComponentRef" />
</template>
