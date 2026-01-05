import { Image } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'static-layer',
	title: 'Static Image Layer',
	description:
		'Display a single static image as a map layer using a custom pixel projection and extent.',
	category: 'core',
	icon: Image,
	tags: ['Core', 'Data'],
	concepts: ['Layer.Static', 'Custom projection', 'Image extent', 'Attributions'],
	order: 4
};

export default meta;
