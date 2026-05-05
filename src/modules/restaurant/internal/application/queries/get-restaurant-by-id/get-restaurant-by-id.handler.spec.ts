import { GetRestaurantByIdHandler } from './get-restaurant-by-id.handler';
import { GetRestaurantByIdQuery } from './get-restaurant-by-id.query';
import { GetRestaurantByIdResponse, MenuItemEntry } from './get-restaurant-by-id.response';
import { RestaurantNotFoundError } from '../../errors/restaurant-not-found.error';
import { IRestaurantRepository, RestaurantWithItems } from '../../../domain/repositories/restaurant.repo.interface';
import { Decimal } from '@prisma/client/runtime/library';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDecimal(value: number): Decimal {
  return new Decimal(value);
}

function buildRestaurant(overrides: Partial<RestaurantWithItems> = {}): RestaurantWithItems {
  return {
    id: 'rest-1',
    name: 'Burger Palace',
    description: 'Best burgers in town',
    imageUrl: 'https://example.com/img.jpg',
    address: '10 Tahrir Square, Cairo',
    category: 'Burgers',
    ownerId: 'user-abc',
    deliveryFee: makeDecimal(25),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    menuItems: [
      {
        id: 'item-1',
        restaurantId: 'rest-1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce',
        price: makeDecimal(89),
        category: 'Burgers',
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date('2024-01-02T00:00:00Z'),
      },
      {
        id: 'item-2',
        restaurantId: 'rest-1',
        name: 'Fries',
        description: null,
        price: makeDecimal(35),
        category: 'Sides',
        imageUrl: 'https://example.com/fries.jpg',
        isAvailable: false,
        createdAt: new Date('2024-01-03T00:00:00Z'),
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Mock repository factory
// ---------------------------------------------------------------------------

function makeRepo(findById: jest.Mock): IRestaurantRepository {
  return {
    findAll: jest.fn(),
    findById,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetRestaurantByIdHandler', () => {
  describe('handle()', () => {
    it('throws RestaurantNotFoundError when repository returns null', async () => {
      const repo = makeRepo(jest.fn().mockResolvedValue(null));
      const handler = new GetRestaurantByIdHandler(repo);

      await expect(handler.handle(new GetRestaurantByIdQuery('non-existent'))).rejects.toThrow(
        RestaurantNotFoundError,
      );
    });

    it('calls repository with the query id', async () => {
      const findById = jest.fn().mockResolvedValue(buildRestaurant());
      const handler = new GetRestaurantByIdHandler(makeRepo(findById));

      await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(findById).toHaveBeenCalledTimes(1);
      expect(findById).toHaveBeenCalledWith('rest-1');
    });

    it('returns a GetRestaurantByIdResponse with correct restaurant fields', async () => {
      const restaurant = buildRestaurant();
      const handler = new GetRestaurantByIdHandler(makeRepo(jest.fn().mockResolvedValue(restaurant)));

      const result = await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(result).toBeInstanceOf(GetRestaurantByIdResponse);
      expect(result.id).toBe('rest-1');
      expect(result.name).toBe('Burger Palace');
      expect(result.description).toBe('Best burgers in town');
      expect(result.imageUrl).toBe('https://example.com/img.jpg');
      expect(result.address).toBe('10 Tahrir Square, Cairo');
      expect(result.category).toBe('Burgers');
      expect(result.deliveryFee).toBe('25');
      expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    });

    it('maps all menu items to MenuItemEntry with stringified price', async () => {
      const restaurant = buildRestaurant();
      const handler = new GetRestaurantByIdHandler(makeRepo(jest.fn().mockResolvedValue(restaurant)));

      const result = await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(result.menuItems).toHaveLength(2);

      const [burger, fries] = result.menuItems;
      expect(burger).toBeInstanceOf(MenuItemEntry);
      expect(burger.id).toBe('item-1');
      expect(burger.name).toBe('Classic Burger');
      expect(burger.price).toBe('89');
      expect(burger.isAvailable).toBe(true);
      expect(burger.imageUrl).toBeNull();

      expect(fries.id).toBe('item-2');
      expect(fries.price).toBe('35');
      expect(fries.isAvailable).toBe(false);
      expect(fries.imageUrl).toBe('https://example.com/fries.jpg');
      expect(fries.description).toBeNull();
    });

    it('returns empty menuItems array when restaurant has no menu items', async () => {
      const restaurant = buildRestaurant({ menuItems: [] });
      const handler = new GetRestaurantByIdHandler(makeRepo(jest.fn().mockResolvedValue(restaurant)));

      const result = await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(result.menuItems).toEqual([]);
    });

    it('maps nullable restaurant fields correctly', async () => {
      const restaurant = buildRestaurant({ description: null, imageUrl: null });
      const handler = new GetRestaurantByIdHandler(makeRepo(jest.fn().mockResolvedValue(restaurant)));

      const result = await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(result.description).toBeNull();
      expect(result.imageUrl).toBeNull();
    });

    it('converts deliveryFee Decimal to string', async () => {
      const restaurant = buildRestaurant({ deliveryFee: makeDecimal(12.5) });
      const handler = new GetRestaurantByIdHandler(makeRepo(jest.fn().mockResolvedValue(restaurant)));

      const result = await handler.handle(new GetRestaurantByIdQuery('rest-1'));

      expect(result.deliveryFee).toBe('12.5');
    });
  });
});
