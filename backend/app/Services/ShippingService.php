<?php
namespace App\Services;
use App\Models\ShippingMethod;
use App\Models\ShippingZone;
use Illuminate\Support\Collection;

class ShippingService {
    public function getAvailableMethods(string $division): Collection {
        $zone = $this->findZoneByDivision($division);
        if (!$zone) return collect();
        return $zone->shippingMethods()->active()->get();
    }
    public function calculateCharge(int $methodId): float {
        $method = ShippingMethod::find($methodId);
        return $method ? (float) $method->price : 0;
    }
    public function findZoneByDivision(string $division): ?ShippingZone {
        return ShippingZone::active()->get()->first(fn($zone) => in_array($division, $zone->divisions));
    }
}
