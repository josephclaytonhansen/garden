<script setup lang="ts">
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
</script>

<template>
    <Tabs default-value="harvest" class = "w-full flex flex-col items-center justify-center">
    <TabsList class = "m-auto">
        <TabsTrigger value="locations">
            Locations
        </TabsTrigger>
        <TabsTrigger value="plant-types">
            Plant Types
        </TabsTrigger>
        <TabsTrigger value="plants">
            Plants
        </TabsTrigger>
        <TabsTrigger value="harvest">
            Harvest
        </TabsTrigger>
        <TabsTrigger value="bug-treatment">
            Bug Treatment
        </TabsTrigger>
    </TabsList>

        <TabsContent value="locations" class = "w-full">
            <h2>Locations</h2>
            <slot name="locations" />
        </TabsContent>
        <TabsContent value="plant-types" class = "w-full">
            <h2>Plant Types</h2>
            <slot name="plant-types" />
        </TabsContent>
        <TabsContent value="plants" class = "w-full">
            <h2>Plants</h2>
            <slot name="plants" />
        </TabsContent>
        <TabsContent value="harvest" class = "w-full">
            <h2>Harvest</h2>
            <slot name="harvest" />
        </TabsContent>
        <TabsContent value="bug-treatment" class = "w-full">
            <h2>Bug Treatment</h2>
            <slot name="bug-treatment" />
        </TabsContent>
    </Tabs>

</template>