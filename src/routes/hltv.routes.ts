import { 
    Router, 
    Request, 
    Response,
    RequestHandler 
} from 'express';

import { 
    hltvService
} from '../services/hltv.service';

const router = Router();

// Match routes // Fix
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

// News route
router.get('/news', (async (req: Request, res: Response) => {
    try {
        const { year, month, eventIds } = req.query;
        
        const yearNumber = year ? Number(year) : undefined;
        
        const eventIdsArray = eventIds 
            ? (Array.isArray(eventIds) 
                ? eventIds.map(id => Number(id))
                : [Number(eventIds)])
            : undefined;

        if (yearNumber && (yearNumber < 2005 || yearNumber > 2022)) {
            return res.status(400).json({
                error: 'Year must be between 2005 and 2022',
                timestamp: new Date().toISOString()
            });
        }

        const validMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        if (month && typeof month === 'string' && !validMonths.includes(month.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid month provided',
                timestamp: new Date().toISOString()
            });
        }

        if ((yearNumber && !month) || (!yearNumber && month)) {
            return res.status(400).json({
                error: 'Both year and month must be provided together',
                timestamp: new Date().toISOString()
            });
        }

        const news = await hltvService.getNews({
            year: yearNumber as any,
            month: month?.toString().toLowerCase() as any,
            eventIds: eventIdsArray
        });
        
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
}) as RequestHandler);

// Ranking routes
router.get('/ranking/teams', (async (req: Request, res: Response) => {
    try {
        const { year, month, day } = req.query;
        
        const yearNumber = year ? Number(year) : undefined;
        const dayNumber = day ? Number(day) : undefined;

        if (yearNumber && (yearNumber < 2015 || yearNumber > 2022)) {
            return res.status(400).json({
                error: 'Year must be between 2015 and 2022',
                timestamp: new Date().toISOString()
            });
        }

        const validMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        if (month && typeof month === 'string' && !validMonths.includes(month.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid month provided',
                timestamp: new Date().toISOString()
            });
        }
        if (dayNumber && (dayNumber < 1 || dayNumber > 31)) {
            return res.status(400).json({
                error: 'Day must be between 1 and 31',
                timestamp: new Date().toISOString()
            });
        }

        const ranking = await hltvService.getTeamRanking({
            year: yearNumber as any,
            month: month?.toString().toLowerCase() as any,
            day: dayNumber
        });
        
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
}) as RequestHandler);

router.get('/ranking/players', (async (req: Request, res: Response) => {
    try {
        const { 
            startDate, 
            endDate, 
            matchType, 
            rankingFilter, 
            maps, 
            minMapCount, 
            countries, 
            bestOfX 
        } = req.query;

        const mapsArray = maps ? (Array.isArray(maps) ? maps : [maps]).map(map => map.toString()) : undefined;
        const countriesArray = countries ? (Array.isArray(countries) ? countries : [countries]).map(country => country.toString()) : undefined;

        const ranking = await hltvService.getPlayerRanking({
            startDate: startDate?.toString(),
            endDate: endDate?.toString(),
            matchType: matchType?.toString() as any,
            rankingFilter: rankingFilter?.toString() as any,
            maps: mapsArray as any,
            minMapCount: minMapCount ? Number(minMapCount) : undefined,
            countries: countriesArray,
            bestOfX: bestOfX?.toString() as any
        });
        
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
}) as RequestHandler);

export default router; 