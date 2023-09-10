package models

// Car represents a car model.

type Car struct {

    Name string             `json:"name,omitempty" validate:"required"`
    Matricule string             `json:"Matricule,omitempty" validate:"required"`
    Mode    byte             `json:"Mode,omitempty" validate:"required"`
}