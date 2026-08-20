<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;
class UserResource extends JsonResource {
    public function toArray($request): array {
        return ['id'=>$this->id,'name'=>$this->name,'email'=>$this->email,'phone'=>$this->phone,'avatar_url'=>$this->avatar_url,'status'=>$this->status,'email_verified_at'=>$this->email_verified_at,'phone_verified_at'=>$this->phone_verified_at,'created_at'=>$this->created_at];
    }
}
