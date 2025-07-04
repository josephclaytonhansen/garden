<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import Button from "../ui/button/Button.vue"

import axios from "axios"

import {
	Icon as GenericIconRenderer,
	Plus,
	Bean,
	Leaf,
	Carrot,
	Citrus,
	LeafyGreen,
	TreeDeciduous,
	Ellipsis,
	Bug,
	Utensils,
	Flower,
	Sprout,
	Replace,
	type IconNode as LucideVueNextIconNode,
	Trash,
	Apple,
	Cherry,
	Wheat,
} from "lucide-vue-next"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Input } from "../ui/input"

import {
	fruit,
	onion,
	pepperChilli,
	watermelon,
	garlic,
	grape,
	peach,
	strawberry,
	flowerTulip,
	flowerLotus,
	avocado,
	kiwi,
	lemon,
	pumpkin,
} from "@lucide/lab"

function getIconDefinitionByName(name: string | null): PlantIconDefinition | undefined {
	if (!name) return undefined
	const lowerName = name.toLowerCase()
	return plantIcons.find((iconDef) => iconDef.name.toLowerCase() === lowerName)
}

interface BugTreatment {
	id: number
	type: string
	date: string
}

interface Plant {
	id: number
	name: string
	icon: string
	plantedAt: string | null
	origin: string
	Vegetables: Vegetable[]
}

interface Vegetable {
	rating: number | null
	id: number
	quantity: number | 1
	harvestedAt: string | null
}

interface Location {
	id: number
	name: string
	description: string
	Plants: Plant[]
	BugTreatments?: BugTreatment[]
}

import {
	Popover,
	PopoverContent,
	PopoverTrigger, // Import PopoverTrigger
} from "@/components/ui/popover"

const locations = ref<Location[]>([])
const isAddPlantPopoverOpen = ref(false)
const currentTargetLocationId = ref<number | null>(null)
const newPlantName = ref("")

const isTransplantPopoverOpen = ref(false)
const transplantCandidateLocation = ref<Location | null>(null)
const selectedPlantToMoveId = ref<number | null>(null)
const selectedDestinationLocationId = ref<number | null>(null)

const newPlantPlantedAt = ref("")
const newPlantOrigin = ref("")
const plantHarvestQuantities = ref<{
	[key: number]: number
}>({})

const selectedIconName = ref<string | null>(null)

type PlantIconDefinition =
	| {
			name: string
			iconData: import("vue").Component
			isLabIcon: false
	  }
	| {
			name: string
			iconData: LucideVueNextIconNode
			isLabIcon: true
	  }

const plantIcons: PlantIconDefinition[] = [
	{
		name: "Bean",
		iconData: Bean,
		isLabIcon: false,
	},
	{
		name: "Leaf",
		iconData: Leaf,
		isLabIcon: false,
	},
	{
		name: "Carrot",
		iconData: Carrot,
		isLabIcon: false,
	},
	{
		name: "Citrus",
		iconData: Citrus,
		isLabIcon: false,
	},
	{
		name: "LeafyGreen",
		iconData: LeafyGreen,
		isLabIcon: false,
	},
	{
		name: "TreeDeciduous",
		iconData: TreeDeciduous,
		isLabIcon: false,
	},
	{
		name: "fruit",
		iconData: fruit as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "onion",
		iconData: onion as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "pepperChilli",
		iconData: pepperChilli as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "watermelon",
		iconData: watermelon as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "garlic",
		iconData: garlic as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "grape",
		iconData: grape as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "peach",
		iconData: peach as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "strawberry",
		iconData: strawberry as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "flowerTulip",
		iconData: flowerTulip as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "flowerLotus",
		iconData: flowerLotus as LucideVueNextIconNode,
		isLabIcon: true,
	},
	{
		name: "Flower",
		iconData: Flower,
		isLabIcon: false,
	},
	{
		name: "Sprout",
		iconData: Sprout,
		isLabIcon: false,
	},
	{
		name: "Apple",
		iconData: Apple,
		isLabIcon: false,
	},
	{
		name: "Cherry",
		iconData: Cherry,
		isLabIcon: false,
	},
	{
		name: "Wheat",
		iconData: Wheat,
		isLabIcon: false,
	},
	{
		name: "Avocado",
		iconData: avocado,
		isLabIcon: true,
	},
	{
		name: "Kiwi",
		iconData: kiwi,
		isLabIcon: true,
	},
	{
		name: "Lemon",
		iconData: lemon,
		isLabIcon: true,
	},
	{
		name: "Pumpkin",
		iconData: pumpkin,
		isLabIcon: true,
	},
]

const API_BASE_URL = `https://${import.meta.env.VITE_API_DOMAIN}`

async function fetchLocations() {
	try {
		const response = await fetch(`${API_BASE_URL}/locations`)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		locations.value = await response.json()
	} catch (error) {
		console.error("Failed to fetch locations:", error)
	}
}

function openAddPlantPopover(locationId: number) {
	currentTargetLocationId.value = locationId
	newPlantName.value = ""
	newPlantPlantedAt.value = ""
	newPlantOrigin.value = ""
	isAddPlantPopoverOpen.value = true
}

const plantsInCandidateLocation = computed(() => {
	return transplantCandidateLocation.value?.Plants || []
})

const availableDestinationLocations = computed(() => {
	if (!transplantCandidateLocation.value) return []
	return locations.value.filter((loc) => loc.id !== transplantCandidateLocation.value!.id)
})

function openTransplantPopoverForLocation(location: Location) {
	if (location.Plants.length === 0) {
		console.warn("No plants available for transplant in this location.")
		return
	}
	transplantCandidateLocation.value = location
	selectedPlantToMoveId.value = null
	selectedDestinationLocationId.value = null
	isTransplantPopoverOpen.value = true
}

async function handleTransplantSubmit() {
	if (!selectedPlantToMoveId.value || !selectedDestinationLocationId.value) {
		console.error("Plant and destination location must be selected.")
		return
	}
	await transplant(selectedPlantToMoveId.value, selectedDestinationLocationId.value)
	isTransplantPopoverOpen.value = false
}
async function transplant(plantId: number, newLocationId: number) {
	try {
		await axios.post(`${API_BASE_URL}/detachPlantFromLocation`, {
			plantId,
		})

		const response = await axios.post(`${API_BASE_URL}/attachPlantToLocation`, {
			plantId,
			locationId: newLocationId,
		})

		console.log("Plant transplanted successfully:", response.data)
		fetchLocations()
	} catch (error) {
		console.error(`Failed to transplant plant ${plantId} to location ${newLocationId}:`, error)
	}
}

async function newBugTreatment(locationId: number, type: string, date: string = new Date().toISOString()) {
	try {
		const response = await axios.post(`${API_BASE_URL}/bug-treatments/new`, {
			locationId,
			type,
			date,
		})
		console.log("Bug treatment created:", response.data)
	} catch (error) {
		console.error("Failed to create bug treatment:", error)
	}
}

async function handleAddPlantSubmit() {
	if (!newPlantName.value.trim() || currentTargetLocationId.value === null) {
		console.error("Plant name and location ID are required.")
		return
	}
	try {
		const payload = {
			name: newPlantName.value,
			plantedAt: newPlantPlantedAt.value || null,
			origin: newPlantOrigin.value,
			icon: selectedIconName.value,
			locationId: currentTargetLocationId.value,
		}
		await axios.post(`${API_BASE_URL}/plants/new`, payload)
		isAddPlantPopoverOpen.value = false
		selectedIconName.value = null
		fetchLocations()
	} catch (error) {
		console.error("Failed to add plant:", error)
	}
}

async function addVegetable(plantId: number, quantity: number) {
	if (quantity <= 0) {
		console.error("Quantity must be greater than 0.")
		return
	}
	try {
		const payload = {
			plantId,
			quantity,
			harvestedAt: new Date().toISOString(),
		}
		await axios.post(`${API_BASE_URL}/vegetables/new`, payload)
		fetchLocations()
	} catch (error) {
		console.error("Failed to add vegetable:", error)
	}
}

async function deleteLocation(locationId: number) {
	try {
		await axios.delete(`${API_BASE_URL}/locations/${locationId}`)
		locations.value = locations.value.filter((loc) => loc.id !== locationId)
	} catch (error) {
		console.error("Failed to delete location:", error)
	}
}

const getLastBugTreatmentDate = (locationId: number) => {
	const location = locations.value.find((loc) => loc.id === locationId)
	const treatments = location?.BugTreatments || []
	if (treatments.length === 0) return "N/A"
	const lastTreatment = treatments.reduce((latest: BugTreatment, current: BugTreatment) => {
		return new Date(current.date) > new Date(latest.date) ? current : latest
	})
	return new Date(lastTreatment.date).toLocaleDateString()
}

const getVegetableCount = (plant: Plant) => {
	return plant.Vegetables ? plant.Vegetables.length : 0
}

const getTotalVegetables = (locationId: number) => {
	const location = locations.value.find((loc) => loc.id === locationId)
	return location?.Plants.reduce((total, plant) => total + (plant.Vegetables ? plant.Vegetables.length : 0), 0) || 0
}

onMounted(() => {
	fetchLocations()
})

defineExpose({
	fetchLocations,
})
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<Card v-for="location in locations" :key="location.id" :value="`location-${location.id}`">
			<CardHeader class="flex items-center justify-between">
				<CardTitle>
					{{ location.name }}
					<TooltipProvider :delayDuration="250">
						<Tooltip>
							<TooltipTrigger>
								<Badge class="ml-4" variant="secondary">{{ location.Plants?.length || 0 }}</Badge>
							</TooltipTrigger>
							<TooltipContent> Total Plants </TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<Badge class="ml-2" variant="outline">{{ getTotalVegetables(location.id) || 0 }}</Badge>
							</TooltipTrigger>
							<TooltipContent> Total Vegetables </TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</CardTitle>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="outline" size="icon" class="ml-2">
								<Ellipsis class="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								class="hover:bg-primary hover:text-white"
								@click="newBugTreatment(location.id, 'neem oil')">
								<Bug class="mr-2" />Neem Oil Treatment
							</DropdownMenuItem>
							<DropdownMenuItem
								class="hover:bg-primary hover:text-white"
								@click="newBugTreatment(location.id, 'diatomaceous earth')">
								<Bug class="mr-2" />Diatomaceous Earth Treatment
							</DropdownMenuItem>
							<DropdownMenuItem
								class="hover:bg-primary hover:text-white"
								@click="deleteLocation(location.id)">
								<Trash class="mr-2" />Delete Location
							</DropdownMenuItem>
							<DropdownMenuItem
								class="hover:bg-primary hover:text-white"
								@select.prevent="openTransplantPopoverForLocation(location)">
								<Replace class="mr-2" />Transplant Plant from this Location
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent>
				<div>
					<h3 class="text-sm text-muted-foreground">
						Last bug treatment:
						{{ getLastBugTreatmentDate(location.id) }}
					</h3>
					<hr class="my-2" />
				</div>

				<Popover
					:open="isAddPlantPopoverOpen && currentTargetLocationId === location.id"
					@update:open="
						(isOpen) => {
							if (!isOpen) {
								isAddPlantPopoverOpen = false
							}
						}
					">
					<PopoverTrigger as-child>
						<Button @click="openAddPlantPopover(location.id)" variant="outline" size="sm" class="mb-2">
							Add Plant
							<Plus class="w-4 h-4 ml-2" />
						</Button>
					</PopoverTrigger>
					<PopoverContent class="w-80">
						<div v-if="currentTargetLocationId === location.id">
							<form @submit.prevent="handleAddPlantSubmit">
								<div class="grid gap-4">
									<h4 class="font-semibold leading-none">Add Plant to {{ location.name }}</h4>
									<div>
										<Label :for="`plantName-${location.id}`">Plant Name</Label>
										<Input
											type="text"
											:id="`plantName-${location.id}`"
											v-model="newPlantName"
											required />
									</div>
									<div>
										<Label :for="`plantedAt-${location.id}`">Planted At</Label>
										<Input
											type="date"
											:id="`plantedAt-${location.id}`"
											v-model="newPlantPlantedAt" />
									</div>
									<div>
										<Label :for="`origin-${location.id}`">Origin</Label>
										<Input type="text" :id="`origin-${location.id}`" v-model="newPlantOrigin" />
									</div>
									<div>
										<Label>Icon</Label>
										<div class="grid grid-cols-5 gap-2 mt-1 border p-2 rounded-md">
											<Button
												v-for="iconItem in plantIcons"
												:key="iconItem.name"
												@click="selectedIconName = iconItem.name"
												variant="outline"
												size="icon"
												:class="{
													'bg-primary text-white': selectedIconName === iconItem.name,
												}"
												type="button">
												<GenericIconRenderer
													v-if="iconItem.isLabIcon"
													:name="iconItem.name"
													:iconNode="iconItem.iconData"
													class="w-5 h-5" />
												<component v-else :is="iconItem.iconData" class="w-5 h-5" />
											</Button>
										</div>
									</div>
									<Button type="submit" class="w-full">Add Plant</Button>
								</div>
							</form>
						</div>
					</PopoverContent>
				</Popover>

				<ul
					class="max-h-28 overflow-y-auto scroll-m-1 scroll"
					style="scrollbar-width: thin; scrollbar-color: var(--color-muted) transparent">
					<li v-if="!location.Plants || location.Plants.length === 0">No plants in location</li>
					<li
						class="flex items-center justify-between mb-1.5 overflow-hidden text-nowrap whitespace-nowrap"
						v-for="plant in location.Plants"
						:key="plant.id">
						<div class="flex items-center w-fit min-w-fit">
							<template v-if="plant.icon && getIconDefinitionByName(plant.icon)">
								<GenericIconRenderer
									v-if="getIconDefinitionByName(plant.icon)!.isLabIcon"
									:name="getIconDefinitionByName(plant.icon)!.name"
									:iconNode="getIconDefinitionByName(plant.icon)!.iconData as LucideVueNextIconNode"
									class="w-5 h-5 mr-2 flex-shrink-0" />
								<component
									v-else
									:is="getIconDefinitionByName(plant.icon)!.iconData"
									class="w-5 h-5 mr-2 flex-shrink-0" />
							</template>
							<span v-else class="inline-block w-5 h-5 mr-2 flex-shrink-0"></span>
							<div class="text-nowrap overflow-ellipsis">
								{{ plant.name }}
							</div>
						</div>

						<div class="flex items-center">
							<Badge class="ml-2 hover:bg-secondary hover:text-primary" variant="secondary">{{ getVegetableCount(plant) }}</Badge>
							<NumberField
								:model-value="plantHarvestQuantities[plant.id] || 1"
								@update:model-value="
									(newValue) => (plantHarvestQuantities[plant.id] = newValue === null ? 1 : newValue)
								"
								class="ml-2 w-24"
								:min="1">
								<NumberFieldContent>
									<NumberFieldDecrement />
									<NumberFieldInput />
									<NumberFieldIncrement />
								</NumberFieldContent>
							</NumberField>
							<Button
								variant="default"
								size="icon"
								class="ml-2 :hover:bg-primary :hover:text-white"
								@click="addVegetable(plant.id, plantHarvestQuantities[plant.id] || 1)">
								<Utensils class="w-4 h-4" />
							</Button>
						</div>
					</li>
				</ul>
			</CardContent>
		</Card>
	</div>

	<Popover v-model:open="isTransplantPopoverOpen">
		<PopoverTrigger as-child>
			<button
				style="
					position: fixed;
					top: 0;
					left: 0;
					width: 0;
					height: 0;
					opacity: 0;
					border: none;
					padding: 0;
					margin: 0;
				"
				aria-hidden="true"
				tabindex="-1"
				ref="transplantPopoverAnchor"></button>
		</PopoverTrigger>
		<PopoverContent class="w-96">
			<div v-if="transplantCandidateLocation">
				<h4 class="font-medium leading-none mb-4">
					Transplant Plant from {{ transplantCandidateLocation.name }}
				</h4>
				<form @submit.prevent="handleTransplantSubmit">
					<div class="grid gap-4">
						<div>
							<Label for="plant-to-transplant" class="mb-1 block">Select Plant to Move</Label>
							<Select v-model="selectedPlantToMoveId">
								<SelectTrigger id="plant-to-transplant">
									<SelectValue placeholder="Choose a plant" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="plant in plantsInCandidateLocation"
										:key="plant.id"
										:value="plant.id">
										{{ plant.name }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label for="destination-location" class="mb-1 block">Move to New Location</Label>
							<Select v-model="selectedDestinationLocationId">
								<SelectTrigger id="destination-location">
									<SelectValue placeholder="Choose destination" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="loc in availableDestinationLocations"
										:key="loc.id"
										:value="loc.id">
										{{ loc.name }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit" class="w-full mt-2">Transplant</Button>
					</div>
				</form>
			</div>
		</PopoverContent>
	</Popover>
</template>

<style scoped lang="scss"></style>
