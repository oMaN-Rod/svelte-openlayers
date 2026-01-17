export function getFlagEmoji(isoCode: string): string {
	if (!isoCode || isoCode.length !== 2) return '🌍';
	const codePoints = isoCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

export function formatNumber(num: number): string {
	if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
	if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
	return num.toString();
}
