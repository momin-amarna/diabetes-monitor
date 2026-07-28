export function createHandler(method, handler) {
  return async function (req, res) {
    if (req.method !== method) {
      res.setHeader('Allow', [method]);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      return await handler(req, res);
    } catch (error) {
      console.error(`Unhandled error in ${req.url}:`, error);
      return res.status(500).json({ error: 'حدث خطأ غير متوقع، حاول مرة أخرى لاحقًا' });
    }
  };
}
