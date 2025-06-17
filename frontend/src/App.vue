<script setup lang="ts">
import { cn } from '@/lib/utils'
import TabNav from '@/components/global/TabNav.vue'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

</script>

<template>
  <div class="flex items-center justify-center h-screen overflow-hidden w-screen flex-col flex-nowrap">
    <Card :class="cn('lg:w-[92vw] lg:h-[92vh] xl:w-[90vw] xl:h-[90vh] md:w-[92vw] md:h-[92vh] w-[100vw] h-[100vh] py-0 xl:overflow-hidden lg:overflow-hidden md:overflow-y-auto sm: overflow-y-auto', $attrs.class ?? '')">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <TabNav>

        </TabNav>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  </div>
</template>
