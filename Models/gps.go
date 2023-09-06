package models

type GPS struct{

	id string             `json:"id,omitempty" validate:"required"`
	vehicule_id string             `json:"vehicule_id,omitempty" validate:"required"`
	line_id string             `json:"line_id,omitempty" validate:"required"`
	driver_id string             `json:"driver_id,omitempty" validate:"required"`
	latt float64             `json:"latt,omitempty" validate:"required"`
	lng float64             `json:"lng,omitempty" validate:"required"`
	alt float64             `json:"alt,omitempty" `
	ip string             `json:"ip,omitempty" validate:"required"`
	speed float32             `json:"speed,omitempty"`
	vuesat float64             `json:"vuesat,omitempty"`
	android_id string             `json:"android_id,omitempty"`
	version string             `json:"version,omitempty"`


}