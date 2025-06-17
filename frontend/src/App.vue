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
    <Card :class="cn('w-[92vw] h-[92vh] py-0 xl:overflow-hidden lg:overflow-hidden md:overflow-y-auto sm: overflow-y-auto', $attrs.class ?? '')">
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
