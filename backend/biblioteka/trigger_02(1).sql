-- CREATE TABLE ProductsPriceLog( --kreiranje tabele
--     LogID INT IDENTITY(1,1) PRIMARY KEY,
--     ProductID INT,
--     OldPrice MONEY,
--     NewPrice MONEY,
--     ActionDate DATETIME2
-- );

CREATE TRIGGER ChangePrice
ON Products
AFTER UPDATE 
AS 
BEGIN

    IF UPDATE(UnitPrice)
    BEGIN
        DECLARE @ProductID INT
        DECLARE @OldPrice MONEY
        DECLARE @NewPrice MONEY

        --DELETED -> stara verzija 
        SELECT @ProductID=d.ProductID, @OldPrice=d.UnitPrice
        FROM deleted d

        -- INSERTED -> nova verzija (nakon update-a!!!)
        SELECT @NewPrice=i.UnitPrice
        from inserted i
    
        INSERT INTO ProductsPriceLog(ProductID, OldPrice, NewPrice, ActionDate)
        VALUES (@ProductID, @OldPrice, @NewPrice, GETDATE())

    END

END

-- SELECT * FROM ProductsPriceLog