      const data = JSON.parse(msg);
  (req: Request & { user: users }, res: Response) => {
      .then((gameId) => res.redirect(`${req.baseUrl}/${gameId}/setup`))
  (req: Request & { user: users }, res: Response) => {
      .then((gameId) => res.redirect(`${req.baseUrl}/${gameId}/setup`))
