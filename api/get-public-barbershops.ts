import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { BarbershopSearchResultItem } from '../types';

// Allow CORS for local development
const allowCors = (fn: (req: VercelRequest, res: VercelResponse) => Promise<void>) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    await fn(req, res);
};

async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const query = sql`
            SELECT 
                bp.id,
                bp.name,
                bp.responsible_name,
                bp.email,
                bp.phone,
                bp.address,
                bp.description,
                bp.logo_url,
                bp.cover_image_url,
                bp.working_hours,
                COALESCE(rev.average_rating, 0) as "averageRating",
                COALESCE(rev.review_count, 0) as "reviewCount",
                COALESCE(sub.plan_id, 'free') as "subscriptionTier",
                COALESCE(srv.sample_services, '[]'::jsonb) as "sampleServices"
            FROM 
                barbershop_profiles bp
            LEFT JOIN (
                SELECT 
                    barbershop_id, 
                    AVG(rating) as average_rating, 
                    COUNT(id) as review_count 
                FROM reviews 
                GROUP BY barbershop_id
            ) rev ON bp.id = rev.barbershop_id
            LEFT JOIN 
                barbershop_subscriptions sub ON bp.id = sub.barbershop_id
            LEFT JOIN LATERAL (
                SELECT jsonb_agg(jsonb_build_object('id', s.id, 'name', s.name, 'price', s.price)) as sample_services
                FROM (
                    SELECT id, name, price
                    FROM services s
                    WHERE s.barbershop_id = bp.id AND s.is_active = true
                    LIMIT 3
                ) s
            ) srv ON true
            ORDER BY
                (CASE WHEN sub.plan_id = 'pro' THEN 0 ELSE 1 END),
                rev.average_rating DESC NULLS LAST;
        `;
        
        const { rows: barbershops } = await query;
        
        // Data from Neon is already in the correct format with aliasing
        const formattedData: BarbershopSearchResultItem[] = barbershops.map(shop => ({
            id: shop.id,
            name: shop.name,
            responsibleName: shop.responsible_name,
            email: shop.email,
            phone: shop.phone,
            address: shop.address,
            description: shop.description,
            logoUrl: shop.logo_url,
            coverImageUrl: shop.cover_image_url,
            workingHours: shop.working_hours,
            averageRating: parseFloat(shop.averageRating) || 0,
            reviewCount: parseInt(shop.reviewCount, 10) || 0,
            subscriptionTier: shop.subscriptionTier,
            sampleServices: shop.sampleServices || [],
        }));


        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching barbershops:', error);
        // Avoid sending detailed error messages to the client in production
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: 'Failed to fetch barbershop data.', details: errorMessage });
    }
}

export default allowCors(handler);