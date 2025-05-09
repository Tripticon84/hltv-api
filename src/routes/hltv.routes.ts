import { 
    Router, 
    Request, 
    Response 
} from 'express';

import { 
    hltvService
} from '../services/hltv.service';

const router = Router();

// Match routes
router.get('/matches', async (req: Request, res: Response) => {
    try {
        const matches = await hltvService.getMatches();
        res.json(matches);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/matches/:id', async (req: Request, res: Response) => {
    try {
        const match = await hltvService.getMatchById(Number(req.params.id));
        res.json(match);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/results', async (req: Request, res: Response) => {
    try {
        const results = await hltvService.getResults({
            eventIds: req.query.eventIds ? JSON.parse(req.query.eventIds as string) : undefined,
            bestOfX: req.query.bestOfX ? JSON.parse(req.query.bestOfX as string) : undefined
        });
        res.json(results);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Team routes
router.get('/teams/:id', async (req: Request, res: Response) => {
    try {
        const team = await hltvService.getTeamById(Number(req.params.id));
        res.json(team);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/teams/stats/:id', async (req: Request, res: Response) => {
    try {
        const stats = await hltvService.getTeamStats(Number(req.params.id));
        res.json(stats);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/teams/name/:name', async (req: Request, res: Response) => {
    try {
        const team = await hltvService.getTeamByName(req.params.name);
        res.json(team);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Player routes
router.get('/players/:id', async (req: Request, res: Response) => {
    try {
        const player = await hltvService.getPlayerById(Number(req.params.id));
        res.json(player);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/players/stats/:id', async (req: Request, res: Response) => {
    try {
        const stats = await hltvService.getPlayerStats(Number(req.params.id));
        res.json(stats);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Event routes
router.get('/events/:id', async (req: Request, res: Response) => {
    try {
        const event = await hltvService.getEventById(Number(req.params.id));
        res.json(event);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/events', async (req: Request, res: Response) => {
    try {
        const events = await hltvService.getEvents();
        res.json(events);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// News route // Access denied Cloudflare
router.get('/news', async (req: Request, res: Response) => {
    try {
        const news = await hltvService.getNews();
        res.json(news);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Ranking routes // Access denied Cloudflare
router.get('/ranking/teams', async (req: Request, res: Response) => {
    try {
        const ranking = await hltvService.getTeamRanking();
        res.json(ranking);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

router.get('/ranking/players', async (req: Request, res: Response) => {
    try {
        const ranking = await hltvService.getPlayerRanking();
        res.json(ranking);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'An unexpected error occurred',
                timestamp: new Date().toISOString()
            });
        }
    }
});

export default router; 