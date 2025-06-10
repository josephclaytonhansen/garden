<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

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
  <div class="flex items-center justify-center h-screen overflow-hidden w-screen">
    <Card :class="cn('w-[380px]', $attrs.class ?? '')">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <NumberField>
        <Label></Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      </CardContent>
      <CardFooter>
        <Button class="w-full">
          <Check class="mr-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
