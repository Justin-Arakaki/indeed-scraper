export default async function retry<T>(
  maxRetries: number,
  callback: () => T
): Promise<Awaited<T> | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callback();
    } catch (e) {
      console.error(e, 'Retrying...');
    }
  }
  console.error('Max retries. Sad.');
}
